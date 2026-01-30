import { Routes } from '@angular/router';
import {HomepageComponent} from "./features/pages/homepage/homepage.component";
import {SignupPageComponent} from "./features/pages/auth/signup-page/signup-page.component";
import {LoginPageComponent} from "./features/pages/auth/login-page/login-page.component";

export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'signup', component: SignupPageComponent},
  {path: 'login', component: LoginPageComponent},

];
