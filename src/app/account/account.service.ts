import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs/Rx';

@Injectable()
export class AccountService {
  userData;
  user = new BehaviorSubject<any>('loading');
}