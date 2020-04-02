import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { FormControl, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    user = {
        email: '',
        password: '',
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

        return true;
    }
}
