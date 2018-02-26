import { Component, OnInit } from '@angular/core';
import { AppService, List } from '../../app.service';
import { AccountService } from '../account.service';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  subscriber: any;
  listCollection: AngularFirestoreCollection<any>;
  listObservable: Observable<any[]>;

  constructor(public accountService: AccountService, public db: AngularFirestore, public router: Router) { }

  ngOnInit() {
    this.subscriber = this.accountService.user.subscribe(
    user => {
      if (user.uid) {
        this.accountService.userData = user;
        this.getLists();
      }
    });
  }

  getLists() {
    this.listCollection = this.db.collection<List>('list', ref => ref.where("userId", "==", this.accountService.userData.uid));
    this.listObservable = this.listCollection.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          let data = a.payload.doc.data();
          data['id'] = a.payload.doc.id;
          return data;
        });
      });
  }

  navList(list?) {
    if (list) { // view/edit
      this.router.navigate(['account/list/' + list.id])
    } else { // create
      this.router.navigate(['account/list/new'])
    }
  }

}
