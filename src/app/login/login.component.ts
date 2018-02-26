import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import * as firebase from 'firebase/app';

import { AppService } from '../app.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLogin = new Login();
  errorMessage: string;
  newUser: boolean = false;

  constructor(public afAuth: AngularFireAuth, public aService: AppService, public router: Router) {}

  ngOnInit() {}
  
  signUp() {
    this.afAuth.auth.onAuthStateChanged
    this.afAuth.auth.createUserWithEmailAndPassword(this.userLogin.username, this.userLogin.password).then(
      success => {
        success.updateProfile({
          displayName: this.userLogin.name
        });
      this.checkReroute();
      }
    ).catch(function(error) {
      let errorCode = error.code;
      this.errorMessage = error.message;
    });
  }

  loginEmail() {
    this.afAuth.auth.signInWithEmailAndPassword(this.userLogin.username, this.userLogin.password)
    .then(() => {
      this.errorMessage = null;
      this.checkReroute();
    }, error => {
      this.errorMessage = error.message;
    });
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => this.checkReroute());
  }

  loginFacebook() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    this.checkReroute();
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['home']);
  }

  checkReroute() {
    //close
  }

}

export class Login {
  username: string;
  password: string;
  name: string;
}