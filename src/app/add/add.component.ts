import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { UsStates } from '../states-dropdown';
import { List, Register } from '../app.service';

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

  constructor(public route: ActivatedRoute, public db: AngularFirestore, public _states: UsStates) { 
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.listId = params.get("id");
      if (this.listId) { // gets list data
        this.registerCollection = this.db.collection<Register>('registers');
        this.listDoc = this.db.doc<List>('list/' + this.listId);
        this.listDoc.valueChanges().subscribe(
          list => {
            this.list = list;
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

  affiliateToRegistry(registry) {
    let routeUrl: string;
    switch (registry.type) {
      case 'target':
      routeUrl = registry.url;
      break;
      case 'amazon':
      routeUrl = registry.url;
      break;
    }
    window.open(routeUrl);    
  }

  ngOnInit() {
  }

}