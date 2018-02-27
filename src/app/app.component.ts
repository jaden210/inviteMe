import { Component } from '@angular/core';
import { AppService } from './app.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router, NavigationEnd } from '@angular/router';
declare var gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(public afAuth: AngularFireAuth, public appService: AppService, public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-114677400-1', {'page_path': event.url});      
      }
    });
  }
}
