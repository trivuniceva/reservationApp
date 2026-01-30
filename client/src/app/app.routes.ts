import { Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {SignupPageComponent} from "./pages/auth/signup-page/signup-page.component";
import {LoginPageComponent} from "./pages/auth/login-page/login-page.component";

export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'signup', component: SignupPageComponent},
  {path: 'login', component: LoginPageComponent},

];
