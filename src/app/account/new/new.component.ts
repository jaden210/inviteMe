import { Component, OnInit } from '@angular/core';
import { List } from '../../app.service';
import { AccountService } from '../account.service';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { UsStates } from '../../states-dropdown';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  providers: [
    UsStates
  ]
})
export class NewComponent implements OnInit {

  list: List = new List();
  listCollection: AngularFirestoreCollection<any>;

  constructor(public accountService: AccountService, public db: AngularFirestore, public router: Router, public _states: UsStates) { 
    this.listCollection = this.db.collection<List>('list');
  }

  createList() {
    this.list.userId = this.accountService.userData.uid;
    let body = JSON.parse(JSON.stringify(this.list));
    this.listCollection.add(body);
    this.accountService.close();
  }

  ngOnInit() {
  }

}
