import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { BlogComponent } from './blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogEntryComponent } from './blog-entry/blog-entry.component';
import { BlogCreateComponent } from './blog-create/blog-create.component';


// Order matters here, first match wins
const blogRoutes: Routes = [
  { path: 'blog', component: BlogComponent, children: [
    { path: '', component: BlogListComponent },
    { path: 'new', component: BlogCreateComponent },
    { path: ':id/:name', component: BlogEntryComponent },
  ]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(blogRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BlogRoutingModule {}
