import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  constructor(public appService: AppService, public bs: BlogService) { }

  ngOnInit() {
  }

}
