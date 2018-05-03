import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Blog } from '../blog.service';

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html',
  styleUrls: ['./blog-entry.component.css']
})
export class BlogEntryComponent implements OnInit {

  constructor(public route: ActivatedRoute, public router: Router, public db: AngularFirestore) { }

  blogDoc: AngularFirestoreDocument<any>;
  blog = new Blog();

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.blogDoc = this.db.doc<Blog>('blog/' + params.get("id"))
      this.blogDoc.valueChanges().subscribe(blog => {
        this.blog = blog;
      });
    });
    
  }
}
