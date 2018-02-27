import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
declare var gtag: Function;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  

  constructor(public appService: AppService, public router: Router) { }

  ngOnInit() {
  }

  getStarted() {
    gtag('event', 'get_started', {
      'event_category' : 'click_through',
      'event_label' : 'account creation'
    });
    this.router.navigate(['/account']);
  }


}
