import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import { User } from '../shared/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    isAuthenticated: boolean;
    username: string;
    name: string;
    errMsg: string = '';
    user: User;

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private authService: AuthService,
        private router: Router
    ){
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(){
        this.authService.loadUserCredentials();

        this.authService.getUsername().subscribe(
            res => {
                this.username = res;
                if(res == undefined){
                    this.isAuthenticated = false;
                }
                else{
                    this.isAuthenticated = true;

                    this.loadUserDetails(this.username);
                }
            },
            err => {
                this.errMsg = err
            }
        );
    }

    loadUserDetails(username: any){
        this.authService.getUserDetails(username)
        .subscribe(res => {
            this.user = res;
            // console.log('User fetched', this.user);
        },
        error => {
            console.log(error);
            this.errMsg = error;
        });
    }

    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    logout(){
        this.authService.logOut();
        this.user = null;
    }
}
