import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs/Rx';

@Injectable()
export class AppService {
  userData: any;
  loginRouteToken: string = null;
  toolbarShadow: boolean;

  constructor() { }

  checkScrollHeight() {
    let content = document.getElementById("site-container");
    if (content.scrollTop > 0) {
      this.toolbarShadow = true;      
    } else {
      this.toolbarShadow = false;
    }
  }

}

export class List {
  userId: string;
  name: string;
  type: string = 'wedding';
  date: Date;
  targetUrl: any;
  amazonUrl: any;
  registries: any;
  time: any;
  linkDate;
  address: any;
  city: any;
  state; any;
  zip: any;
}


export class Register {
  applicantType: string = 'single';
  firstName: string;
  partnerFirstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  listId: string;
  headCount: number = 1;
  emailRequest: boolean = false;
  email: string;
  isPrinted: boolean = false;
  isEmailed: boolean = false;
}