import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable()
export class AccountService {
  userData;
  user = new BehaviorSubject<any>('loading');
  
  constructor(public router: Router){}

  close() {
    this.router.navigate(['account']);
  }
}