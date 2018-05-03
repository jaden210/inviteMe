import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { List, Register } from '../../app.service';
import * as jsPDF from 'jspdf'
import { UsStates } from '../../states-dropdown';
import { MatSnackBar } from '@angular/material';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  share: any = window.navigator;
  subscriber;
  listDoc: AngularFirestoreDocument<any>;
  list: List = new List();
  listId;
  registersCollection: AngularFirestoreCollection<any>;
  registers: Observable<any>;
  registerDoc : AngularFirestoreDocument<any>;
  registersStats = new RegistersStats();
  _states = new UsStates().states;
  listSearch: string;
  registerExport = [];

  constructor(public route: ActivatedRoute, public accountService: AccountService, public db: AngularFirestore, public router: Router, public snackbar: MatSnackBar) { }

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
            if (register.emailRequest) { this.registersStats.emailList.push(register); } // e-invite email list
            if (register.emailRequest && !register.isEmailed) { this.registersStats.unemailed.push(register); } // e-invite unemailed
            if (!register.emailRequest) { // do lots of formatting stuff here
              let obj = {};
              obj['firstName'] = register.firstName + register.partnerFirstName ? '& ' + register.partnerFirstName : null;
              obj['lastName'] = register.lastName;
              obj['street'] = register.street;
              obj['address'] = register.city, ' ' + register.state + ' ' + register.zip;
              this.registerExport.push(obj);
            }
          });
        }
      )
  }

  updateList() {
    this.listDoc.update(this.list);
  }

  addToList() {
    localStorage.removeItem("InviteMe" + this.listId);
    this.router.navigate(['/add/' + this.listId]);
  }

  copyLink(id) {
   if (window.getSelection) {
      var range = document.createRange();
       range.selectNode(document.getElementById(id));
       window.getSelection().addRange(range);
       document.execCommand("copy");
       let snackBar = this.snackbar.open("copied!", null, {
         duration: 2000
       });
      }
    }
    
    copyAddress(register: Register, address){
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      let name = (register.firstName ? register.firstName + ' ' : '') + (register.partnerFirstName ? 'and ' + register.partnerFirstName + ' ' : '') + register.lastName;
      let copyAddress = name + ' ' + register.street + ' ' + register.city + ', ' + register.state + ' ' + register.zip;
      selBox.value = address ? copyAddress : register.email;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      let snackBar = this.snackbar.open("copied!", null, {
        duration: 2000
      });
    }

  shareLink() {
    if (this.share.share !== undefined) {
      this.share.share({
        title: 'Your Invited!',
        url: this.shareLink
      });
    } 

  }

  navLink() { window.open(this.list.shareUrl, "_blank"); }

  removeFromList(register) {
    this.registersCollection.doc(register.id).delete().then(
      () => console.log("deleted") 
    );
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

  print(columns, rows, all, fontSize, lineSpace, labelGap) {
    let registersOb = this.registersCollection.snapshotChanges().subscribe(
      registers => {
        let doc = new jsPDF();
        doc.setFontSize(fontSize);
        let i = 0;
        let x = 0;
        let y = 13;
        let colWidth = (doc.internal.pageSize.width / columns) + 5;
        registers.forEach(register => {
          let user = register.payload.doc.data();
          if (!user.emailRequest) {
            if (!user.isPrinted || all) {
              user.isPrinted = true; // set printed flag
              this.registersCollection.doc(register.payload.doc.id).update(user); //update value. this could be slow if there are a lot.
              let name = (user.firstName ? user.firstName + ' ' : '') + (user.partnerFirstName ? user.partnerFirstName + ' ' : '') + user.lastName;
              doc.text(name, x, y);
              doc.text(user.street, x, y + lineSpace);
              doc.text(user.city + ', ' + user.state + ' ' + user.zip, x, y + (lineSpace * 2));
              i++;
              y += labelGap;
              if (i == rows || i == (rows * 2) || i == (rows * 3)) {
                x += colWidth;
                y = 13;
              }
              if (i == rows * columns) {
                doc.addPage();
                i = 0;
                x = 0;
                y = 13;
              }
            }
          }
      });
      doc.save('labels');
      registersOb.unsubscribe();
    });
  }
  
  printReturn(columns, rows, all, fontSize, lineSpace, labelGap, size) {
    let doc = new jsPDF();
    doc.setFontSize(fontSize);
    let i = 0;
    let x = 0;
    let y = 13;
    let colWidth = (doc.internal.pageSize.width / columns) + 5;
    for (let r = 0; r < size; r++) {
      let name = this.list.name;
          doc.text(name, x, y);
          doc.text(this.list.returnAddress, x, y + lineSpace);
          doc.text(this.list.returnCity + ', ' + this.list.returnState + ' ' + this.list.returnZip, x, y + (lineSpace * 2));
          i++;
          y += labelGap;
          if (i == rows || i == (rows * 2) || i == (rows * 3)) {
            x += colWidth;
            y = 13;
          }
          if (i == rows * columns) {
            doc.addPage();
            i = 0;
            x = 0;
            y = 13;
          }
      };
      doc.save('returnLabels');
  }
  
  email(register) {
    this.registerDoc = this.db.doc<Register>('registers/' + register.id);
    register.isEmailed = true;
    this.registerDoc.update(register);
    var subject = "You're Invited!";
    var emailBody = 'This is your special invite to join ' + this.list.name + ' at our ' + this.list.type + '. The event will take place on ' +
    this.list.date + ' at ' + this.getNormalTime(this.list.time) + '. Feel free to join us by coming to ' + this.list.address + ' ' + this.list.city + ', ' + this.list.state + 
    ' ' + this.list.zip + '. We cant wait to see you there!';
    window.open("mailto:" + register.email + "?subject=" + subject+"&body="+emailBody, "_blank");
  }

  emailAll(list) {
    let emailList = [];
    list.forEach(register => {
      emailList.push(register.email);
      this.registerDoc = this.db.doc<Register>('registers/' + register.id);
      register.isEmailed = true;
      this.registerDoc.update(register);
    });
    var subject = "You're Invited!";
    var emailBody = 'This is your special invite to join ' + this.list.name + ' at our ' + this.list.type + '. The event will take place on ' +
    this.list.date + ' at ' + this.getNormalTime(this.list.time) + '. Feel free to join us by coming to ' + this.list.address + ' ' + this.list.city + ', ' + this.list.state + 
    ' ' + this.list.zip + '. We cant wait to see you there!';
    window.open("mailto:?bcc=" + emailList + "?subject=" + subject+"&body="+emailBody, "_blank");
  }

  exportToCsv() {
    new Angular2Csv(JSON.stringify(this.registerExport), 'invitationList', {showLabels:true});
  }

  getNormalTime(time) {
    let hourEnd = time.indexOf(":");
    let H = +time.substr(0, hourEnd);
    let h = H % 12 || 12;
    let ampm = (H < 12 || H === 24) ? "AM" : "PM";
    return time = h + time.substr(hourEnd, 3) + ampm;
  }

  updateRegister(register) {
    this.registersCollection.doc(register.id).set(register).then(
      () => console.log("updated") 
    );
  }
    
  
}

export class RegistersStats {
  count;
  people = 0;
  unprinted = 0;
  unemailed: Register[] = [];
  emailList: Register[] = [];
}