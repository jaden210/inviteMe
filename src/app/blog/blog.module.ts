import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MaterialModule } from '../material.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogService } from './blog.service';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { BlogEntryComponent } from './blog-entry/blog-entry.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogComponent } from './blog.component';



@NgModule({
  declarations: [
    BlogCreateComponent,
    BlogEntryComponent,
    BlogListComponent,
    BlogComponent
  ],
  imports: [
    BlogRoutingModule,
    BrowserModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [
    BlogService
  ]
})
export class BlogModule { }
