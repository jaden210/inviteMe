import { Component, OnInit } from '@angular/core';
import { AppService, List } from '../app.service';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { AccountService } from './account.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  subscriber;

  constructor(public appService: AppService, public dialog: MatDialog, public accountService: AccountService, public afAuth: AngularFireAuth) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.accountService.user.next(user);
        this.accountService.userData = user;
        
      } else {
        let dialog = this.dialog.open(LoginComponent)
      }
    });
  }

}
