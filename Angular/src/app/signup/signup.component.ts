import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import {FormControl, Validators} from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    user = {
        email: '',
        password: '',
        confirm_password: '',
        name: ''
    }

    errMsg: string;
    loading: Boolean = false;

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

    ngOnInit(): void {
    }

    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    onSubmit() {
        this.loading = true;
        // console.log("User: ", this.user);
        if(this.validate()){
            // user signup
            this.authService.signUp(this.user)
            .subscribe(res => {
                if (res.success) {

                    // login user
                    this.authService.logIn(this.user)
                    .subscribe(res => {
                        if (res.success) {
                            // Redirect if login successful
                            this.router.navigate(['/']);
                        } else {
                            console.log(res);
                        }
                    },
                    error => {
                        console.log(error);
                        this.errMsg = error;
                    });

                    // Redirect if signup successful but login not successful
                    // this.router.navigate(['/']);

                } else {
                    // console.log(res);
                }
            },
            error => {
                this.errMsg = error;
                // console.log(error);
            });
        }

        this.loading = false;
    }

    validate(){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.user.email)){
            this.errMsg = '';
        }
        else{
            this.errMsg = '* Enter a valid email address';
            return false;
        }

        if(this.user.password != this.user.confirm_password){
            this.errMsg = '* The passwords are not same';
            return false;
        }
        else{
            this.errMsg = '';
        }

        if(this.user.password.length < 8){
            this.errMsg = '* Password should be > 7 chars';
            return false;
        }
        else{
            this.errMsg = '';
        }

        if(this.user.name.length < 4){
            this.errMsg = '* Name should be > 3 chars';
            return false;
        }
        else{
            this.errMsg = '';
        }

        return true;
    }
}
