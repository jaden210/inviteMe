import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BlogService {
  userData;
  user = new BehaviorSubject<any>('loading');
  
  constructor(public router: Router, public http: HttpClient){}

  close() {
    this.router.navigate(['account']);
  }

  shortenUrl(id) {
    let body = { longUrl: 'https://inviteme.me/add/' + id };
    return this.http.post<any>('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDL4fy4eed6eQB8oufyHVemscs3AEgQQfM', body);
  }
}


export class Blog {
  id: string;
  title: string;
  body: string;
  topics: any[] = [];
  createdAt: Date;
}