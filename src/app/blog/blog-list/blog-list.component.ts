import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { Observable } from '@firebase/util';
import { Blog } from '../blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {

  
  blogCollection: AngularFirestoreCollection<any>;
  blogObservable;

  constructor(public db: AngularFirestore, public router: Router, public appService: AppService) { }

  ngOnInit() {
    this.blogCollection = this.db.collection<any>('blog', ref => ref.orderBy("createdAt", "desc")); // order
    this.blogObservable = this.blogCollection.snapshotChanges().map(actions => {
        return actions.map(a => {
          let data = a.payload.doc.data();
          data['id'] = a.payload.doc.id;
          return data;
        });
      });
  }

  viewBlog(blog: Blog) {
    this.router.navigate(['blog/' + blog.id + '/' + blog.body.split('/').join('%2F').split(' ').join('-')]);
  }

}
