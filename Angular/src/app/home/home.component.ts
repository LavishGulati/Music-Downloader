import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { saveAs } from "file-saver";

import { User } from '../shared/user';

import { SongService } from '../services/song.service';

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

    btn_name = "Search..";
    form_msg = "Search for a song and wait for the magic..";

    loading: boolean = false;

    chosenFormat: string = 'mp3';

    formats: string[] = [
        'mp3',
        'mp4',
        'wav'
    ];

    song = {
        name: '',
        album: '',
        format: 'mp3'
    }

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private authService: AuthService,
        private router: Router,
        private songService: SongService
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

    onSubmit(){
        // console.log(this.song);
        this.loading = true;
        if(this.validate()){
            this.songService.postSongRequest(this.song)
            .subscribe((res) => {
                console.log(res);
                if(res.present){
                    this.songService.getSong(res.status).subscribe((res) => {
                        window.open(window.URL.createObjectURL(res));
                    });
                    this.btn_name = "Search..";
                    this.form_msg = "Search for a song and wait for the magic..";
                }
                else{
                    this.btn_name = "Open";
                    this.form_msg = "Your song is ready! Click on Open to listen..";
                }

            },
            error => {
                console.log(error);
            });
        };
        this.loading = false;
    }

    validate(){
        this.song.name = this.song.name.replace(/^\s+/, '').replace(/\s+$/, '');
        if(this.song.name == ''){
            this.errMsg = 'Name of the song is required';
            return false;
        }
        else{
            this.errMsg = '';
        }

        return true;
    }
}
