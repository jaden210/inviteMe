import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AccountService {
  userData;
  user = new BehaviorSubject<any>('loading');
  webApiKey = 'AIzaSyAmOp8GI489gUnXNbfcu7PiJAaZ4Mkrx9c';
  
  constructor(public router: Router, public http: HttpClient){}

  close() {
    this.router.navigate(['account']);
  }

  shortenUrl(id) {
    let body = {
      "dynamicLinkInfo": {
        "dynamicLinkDomain": "n3m6x.app.goo.gl",
        "link": 'https://inviteme.me/add/' + id,
      },
      "suffix": {
        "option": "SHORT"
      }
    }
    return this.http.post<any>('https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' + this.webApiKey, body);
  }
}