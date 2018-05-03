import { Component, OnInit } from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Blog } from '../blog.service';

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})
export class BlogCreateComponent implements OnInit {

  separatorKeysCodes = [ENTER, COMMA];
  blog: Blog = new Blog;
  blogCollection: AngularFirestoreCollection<any>;

  constructor(public db: AngularFirestore, public router: Router) { 
    this.blogCollection = this.db.collection<Blog>('blog');
  }

  addTopic(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      this.blog.topics.push({ name: value.trim() });
    }
    if (input) {
      input.value = '';
    }
  }

  removeTopic(topic: any): void {
    let index = this.blog.topics.indexOf(topic);
    if (index >= 0) {
      this.blog.topics.splice(index, 1);
    }
  }

  createBlog() {
    this.blog.createdAt = new Date();
    let body = JSON.parse(JSON.stringify(this.blog));
    this.blogCollection.add(body).then(
      () => {
        this.router.navigate(['/blog']);
      }, 
      error => console.log("error")
    );

    // add topics to a central list for search
  }

  ngOnInit() {
  }

}
