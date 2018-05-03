import { Component, OnInit } from '@angular/core';
import { List } from '../../app.service';
import { AccountService } from '../account.service';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
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
  listDoc: AngularFirestoreDocument<any>;


  constructor(public accountService: AccountService, public db: AngularFirestore, public router: Router, public _states: UsStates) { 
    this.listCollection = this.db.collection<List>('list');
  }
  
  submitForm() {
    this.list.userId = this.accountService.userData.uid;
    let body = JSON.parse(JSON.stringify(this.list));
    this.listCollection.add(body).then(
      newList => {
        this.listDoc = this.db.doc<List>('list/' + newList.id);
        this.accountService.shortenUrl(newList.id).subscribe(
          url => {
            this.list.shareUrl = url.shortLink;
            let obj = JSON.parse(JSON.stringify(this.list)); //not sure why
            this.listDoc.update(obj);
          }
        );
      }
    );
    this.accountService.close();
  }

  ngOnInit() {
  }

}
