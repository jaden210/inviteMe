import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { List, Register } from '../../app.service';
import * as jsPDF from 'jspdf'

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
          this.registersStats = new RegistersStats();
          this.registersStats.count = registers.length;
          registers.forEach(register => {
            this.registersStats.people = this.registersStats.people + register.headCount;
            if (!register.isPrinted && !register.emailRequest) { this.registersStats.unprinted += 1; }
          });
        }
      )
  }

  updateList() {
    this.listDoc.update(this.list);
  }

  copyLink() {

  }

  navLink() { window.open("https://inviteme.me/add/" + this.listId, "_blank"); }

  removeFromList(register) {
    this.registersCollection.doc(register.id).delete().then(
      () => console.log("deleted") 
    )
  }

  getDate(list) {
    if (list.date) {
      let now = new Date();
      let endDate = new Date(list.date);
      let dis = endDate.getTime() - now.getTime();
      if (dis > 0) {
        let day = Math.floor( dis / 86400000);
        let hour = Math.floor((dis % 86400000) / 3600000);
        return day + 'd ' + hour + 'h till event';
      } else return 'event is over';
    }
    return 'No end date';
  }

  getLinkDate(list) {
    if (list.linkDate) {
      let now = new Date();
      let endDate = new Date(list.linkDate);
      let dis = endDate.getTime() - now.getTime();
      if (dis > 0) {
        let day = Math.floor( dis / 86400000);
        let hour = Math.floor((dis % 86400000) / 3600000);
        return day + 'd ' + hour + 'h';
      } else return 'link expired';
    }
    return 'No date set';
  }

  print(columns, rows, all) {
    let registersOb = this.registersCollection.snapshotChanges().subscribe(
      registers => {
        let doc = new jsPDF();
        doc.setFontSize(9);
        let i = 0;
        let x = 20;
        let y = 20;
        let colWidth = doc.internal.pageSize.width / columns;
        registers.forEach(register => {
          let user = register.payload.doc.data();
          if (!user.emailRequest) {
            if (!user.isPrinted || all) {
              user.isPrinted = true; // set printed flag
              this.registersCollection.doc(register.payload.doc.id).update(user); //update value. this could be slow if there are a lot.
              let name = (user.firstName ? user.firstName + ' ' : '') + (user.partnerFirstName ? user.partnerFirstName + ' ' : '') + user.lastName;
              doc.text(name, x, y);
              doc.text(user.street, x, y + 5);
              doc.text(user.city + ', ' + user.state + ' ' + user.zip, x, y + 10);
              i++;
              y += 27;
              if (i == rows) {
                x += colWidth;
                y = 20;
              }
              if (i == rows * columns) {
                doc.addPage();
                i = 0;
                x = 20;
                y = 20;
              }
            }
          }
      });
      doc.save('labels');
      registersOb.unsubscribe();
    });
    }    
    
  
}

export class RegistersStats {
  count;
  people = 0;
  unprinted = 0;
}