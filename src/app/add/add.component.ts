import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { UsStates } from '../states-dropdown';
import { List, Register, AppService } from '../app.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [
    UsStates
  ]
})
export class AddComponent implements OnInit {

  listDoc: AngularFirestoreDocument<List>;
  list: List = new List();
  registerCollection: AngularFirestoreCollection<Register>;
  register: Register = new Register();
  listId: any;
  submitted: boolean = false;
  linkExpired: boolean = false;

  constructor(public route: ActivatedRoute, public db: AngularFirestore, public _states: UsStates, public appService: AppService) { 
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.listId = params.get("id");
      if (this.listId) { // gets list data
        this.registerCollection = this.db.collection<Register>('registers');
        this.listDoc = this.db.doc<List>('list/' + this.listId);
        this.listDoc.valueChanges().subscribe(
          list => {
            this.list = list;
            let now = new Date(); // check link date
            let endDate = new Date(list.linkDate);
            let dis = endDate.getTime() - now.getTime();
            if (dis < 0) this.linkExpired = true;
        });
        localStorage.getItem("InviteMe" + this.listId) ? this.submitted = true : null;
        }
    });
  }

  submitForm() {
    this.submitted = true;
    localStorage.setItem("InviteMe" + this.listId, "sent" );
    this.register.listId = this.listId;
    let body = JSON.parse(JSON.stringify(this.register));
    this.registerCollection.add(body);
  }

  affiliateToRegistry(link) {
    // try and sumbit first
    let routeUrl: string;
    switch (link) {
      case 'target':
      if (this.list.targetUrl.substring(0, 4) == 'http') {
        routeUrl = this.list.targetUrl + this.appService.targetAffUrl;
      } else {
        routeUrl = 'http://' + this.list.targetUrl + this.appService.targetAffUrl;
      }
      break;
      case 'amazon':
      routeUrl = this.list.amazonUrl + this.appService.amazonAffUrl;
      break;
      case 'walmart':
      routeUrl = this.appService.walmartAffUrl.replace('*', this.list.walmartUrl);
      break;
    }
    window.open(routeUrl);    
  }

  ngOnInit() {
  }

}