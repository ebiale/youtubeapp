import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {YoutubeResponse} from '../models/youtube.models';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private youtubeUrl = 'https://www.googleapis.com/youtube/v3';
  private apikey     = 'AIzaSyBHLZzytcylRRpuFepi2mHyMD3Ede-r7-s';
  private playlist   = 'UUuaPTYj15JSkETGnEseaFFg';
  private nextPageToken = '';
  private previousPageToken = '';

  constructor(private http: HttpClient) {}

  lastPage() {
    return this.nextPageToken === '' || this.nextPageToken === undefined;
  }

  firstPage() {
    return this.previousPageToken === '' || this.previousPageToken === undefined;
  }
  getVideos(page: string) {
    const url = `${this.youtubeUrl}/playlistItems`;
    let token = '';
    if (page === 'n'  && this.nextPageToken) {
      token = this.nextPageToken;
    } else if ( page === 'p' && this.previousPageToken) {
      token = this.previousPageToken;
    }
    const params = new HttpParams()
      .set('part', 'snippet')
      .set('maxResults', '20')
      .set('playlistId', this.playlist)
      .set('key', this.apikey)
      .set('pageToken', token);

    return this.http
      .get<YoutubeResponse>(url, { params })
      .pipe(
        map((resp: YoutubeResponse) => {
          this.nextPageToken = resp.nextPageToken;
          this.previousPageToken = resp.prevPageToken;
          return resp.items;
        }),

        map((items) => items.map((video) => video.snippet))
      );
  }
}
