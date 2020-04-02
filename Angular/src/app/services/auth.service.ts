import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './httpmsg.service';

import { User } from '../shared/user';

interface AuthResponse {
    status: string;
    success: string;
    token: string;
}

interface JWTResponse {
    status: string;
    success: string;
    user: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    tokenKey = 'JWT';
    isAuthenticated: Boolean = false;
    username: Subject<string> = new Subject<string>();
    authToken: string = undefined;

    constructor(
        private http: HttpClient,
        private processHTTPMsgService: ProcessHTTPMsgService
    ) {

    }

    checkJWTtoken() {
        this.http.get<JWTResponse>(baseURL + 'users/checkJWTtoken').subscribe(res => {
            // console.log('JWT Token Valid: ', res);
            this.sendUsername(res.user.username);
        },
        err => {
            // console.log('JWT Token invalid: ', err);
            this.destroyUserCredentials();
        });
    }

    sendUsername(name: string) {
        this.username.next(name);
    }

    clearUsername() {
        this.username.next(undefined);
    }

    loadUserCredentials() {
        const credentials = JSON.parse(localStorage.getItem(this.tokenKey));
        // console.log('loadUserCredentials ', credentials);
        if (credentials && credentials.username !== undefined) {
            this.useCredentials(credentials);
            if (this.authToken) {
                this.checkJWTtoken();
            }
        }
        return credentials;
    }

    storeUserCredentials(credentials: any) {
        // console.log('storeUserCredentials ', credentials);
        localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
        this.useCredentials(credentials);
    }

    useCredentials(credentials: any) {
        this.isAuthenticated = true;
        this.sendUsername(credentials.username);
        this.authToken = credentials.token;
    }

    destroyUserCredentials() {
        this.authToken = undefined;
        this.clearUsername();
        this.isAuthenticated = false;
        localStorage.removeItem(this.tokenKey);
    }

    signUp(user: any): Observable<any>{
        return this.http.post<AuthResponse>(baseURL + 'users/signup',
        {'username': user.email, 'email': user.email, 'password': user.password, 'name': user.name})
        .pipe( map(res => {
            // this.storeUserCredentials({username: user.username, token: res.token});
            return {'success': true, 'result': res };
        }),
        catchError(error => {
            return this.processHTTPMsgService.handleError(error);
        }));
    }

    logIn(user: any): Observable<any> {
        return this.http.post<AuthResponse>(baseURL + 'users/login',
        {'username': user.email, 'password': user.password})
        .pipe( map(res => {
            this.storeUserCredentials({
                username: user.email,
                token: res.token,
            });
            return {'success': true, 'username': user.username };
        }),
        catchError(error => this.processHTTPMsgService.handleError(error)));
    }

    logOut() {
        this.destroyUserCredentials();
    }

    isLoggedIn(): Boolean {
        return this.isAuthenticated;
    }

    getUsername(): Observable<string> {
        return this.username.asObservable();
    }

    getToken(): string {
        return this.authToken;
    }

    getUserDetails(username: any): Observable<User>{
        // console.log(username);
        return this.http.get<User>(baseURL + 'users?username=' + username)
        .pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
