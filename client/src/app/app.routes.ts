import { Routes } from '@angular/router';
import {HomepageComponent} from "./features/pages/homepage/homepage.component";
import {SignupPageComponent} from "./features/pages/auth/signup-page/signup-page.component";
import {LoginPageComponent} from "./features/pages/auth/login-page/login-page.component";
import {ProfilePageComponent} from "./features/pages/profile-page/profile-page.component";
import {NotificationPageComponent} from "./features/pages/notification-page/notification-page.component";

export const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'signup', component: SignupPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'profile', component: ProfilePageComponent},
  {path: 'profile', component: ProfilePageComponent},
  {path: 'notification', component: NotificationPageComponent},

];
