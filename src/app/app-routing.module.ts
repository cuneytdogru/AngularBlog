import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/components/about/about.component';
import { BlogDetailComponent } from './blog/components/blog-detail/blog-detail.component';
import { BlogComponent } from './blog/components/blog/blog.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      { path: '', redirectTo: 'blog', pathMatch: 'full' },
      {
        path: 'blog',
        component: BlogComponent,
      },
      {
        path: 'blog/:id',
        component: BlogDetailComponent,
      },
      { path: 'about', component: AboutComponent },

      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
