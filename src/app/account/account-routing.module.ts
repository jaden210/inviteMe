import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { NewComponent } from './new/new.component';
import { ListsComponent } from './lists/lists.component';
import { AccountComponent } from './account.component';
import { ListComponent } from './list/list.component';


// Order matters here, first match wins
const accountRoutes: Routes = [
  { path: 'account', component: AccountComponent, children: [
  { path: '', component: ListsComponent },
  { path: 'list/new', component: NewComponent },
  { path: 'list/:id', component: ListComponent }
  ]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(accountRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule {}
