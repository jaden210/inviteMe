import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ListComponent } from './list/list.component';
import { ListsComponent } from './lists/lists.component';
import { NewComponent } from './new/new.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountService } from './account.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MaterialModule } from '../material.module';
import { AccountComponent } from './account.component';



@NgModule({
  declarations: [
    ListComponent,
    ListsComponent,
    NewComponent,
    AccountComponent
  ],
  imports: [
    AccountRoutingModule,
    BrowserModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AccountService
  ]
})
export class AccountModule { }
