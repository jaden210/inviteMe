import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { List } from '../../app.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  subscriber;
  listDoc: AngularFirestoreDocument<any>;
  list: List = new List();
  listId;
  registersCollection: AngularFirestoreCollection<any>;
  registers: Observable<any>;
  registersStats = new RegistersStats();

  constructor(public route: ActivatedRoute, public accountService: AccountService, public db: AngularFirestore, public router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.listId = params.get("id");
        if (this.listId) {
          this.subscriber = this.accountService.user.subscribe(
            user => {
              if (user.uid) {
              this.getList();
              }
            }
          );
        }
      });
  }

  getList() {
    this.listDoc = this.db.doc<List>('list/' + this.listId);
    this.listDoc.valueChanges().subscribe(
      list => {
        this.list = list;
    });
    this.registersCollection = this.db.collection<any>('registers', ref => ref.where("listId", "==", this.listId));
    this.registers = this.registersCollection.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          let data = a.payload.doc.data();
          data['id'] = a.payload.doc.id;
          return data;
        });
      });
      this.registers.subscribe(
        registers => {
          this.registersStats.count = registers.length;
          registers.forEach(register => {
            this.registersStats.people = this.registersStats.people + register.headCount;
          });
        }
      )
  }

  updateList() {
    this.listDoc.update(this.list);
  }

  copyLink() {

  }

  navLink() {
    window.open("https://inviteme.me/add/" + this.listId, "_blank");
  }

  removeFromList(register) {
    this.registersCollection.doc(register.id).delete().then(
      () => console.log("deleted")
      
    )
  }

}

export class RegistersStats {
  count;
  people = 0;
}