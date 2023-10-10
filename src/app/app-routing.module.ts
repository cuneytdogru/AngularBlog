import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/components/about/about.component';
import { BlogDetailComponent } from './blog/components/blog-detail/blog-detail.component';
import { BlogComponent } from './blog/components/blog/blog.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { RegisterComponent } from './register/components/register.component';
import { HomeComponent } from './pages/home/home.component';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './login/components/login.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'blog',
        pathMatch: 'full',
      },
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
