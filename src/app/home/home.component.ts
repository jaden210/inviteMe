import { Component, OnInit,  } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
declare var gtag: Function;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  

  constructor(public appService: AppService, public router: Router, private metaService: Meta) {
    metaService.addTags([
    { name: 'description', content: "InviteMe.me is the perfect list creation tool. Weddings, birthdays, or any other event. People sign up, add a registry, and create a one-stop-shop for you and the consumer."},
    { name: 'author', content: 'Invite Me'},
    { name: 'keywords', content: 'list, list tool, wedding list, list creation, invite me, angular, invite list, wedding, birthday, event, registry, wedding registry'}      
    ])
   }

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
