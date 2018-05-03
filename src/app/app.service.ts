import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable()
export class AppService {
  userData: any;
  loginRouteToken: string = null;
  toolbarShadow: boolean;
  targetAffUrl: string = '?clkid=68c0c91fNb752907b857e1406f2529fa0&lnm=81938&afid=InviteMe&ref=tgt_adv_xasd0002#1';
  walmartAffUrl: string = 'http://linksynergy.walmart.com/fs-bin/click?id=daMsBIFz/0Q&type=10&tmpid=1081&offerid=223073.7442&RD_PARM1=https%253A%252F%252F*%2526affs%253De';
  amazonAffUrl: string = '?&_encoding=UTF8&tag=inviteme07-20&linkCode=ur2&camp=1789&creative=9325';
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
  targetUrl: string;
  amazonUrl: string;
  walmartUrl: string;
  zolaUrl: string;
  registries: any;
  time: any;
  linkDate;
  address: any;
  city: any;
  state; any;
  zip: any;
  returnAddress: any;
  returnCity: any;
  returnState: any;
  returnZip: any;
  shareUrl: string;
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
  note: string;
}