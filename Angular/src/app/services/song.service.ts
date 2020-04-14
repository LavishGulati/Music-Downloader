import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './httpmsg.service';

import { Song } from '../shared/song';

@Injectable({
  providedIn: 'root'
})
export class SongService {

    constructor(
        private http: HttpClient,
        private processHTTPMsgService: ProcessHTTPMsgService
    ) { }

    postSongRequest(song: any): Observable<any>{
        return this.http.post<any>(baseURL + 'songs', song)
        .pipe(map(res => {
            return res;
        }),
        catchError(error => this.processHTTPMsgService.handleError(error)));
    }

    getSong(url): Observable<any>{
        return this.http.get(baseURL + 'songs/' + url, {responseType: 'blob'})
        .pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
