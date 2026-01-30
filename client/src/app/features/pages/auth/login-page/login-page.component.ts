import { Component } from '@angular/core';
import {LoginFormComponent} from "../../../components/auth/login-form/login-form.component";
import {AuthService} from "../../../../core/service/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    LoginFormComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  constructor(private authService: AuthService, private router: Router) { }

  forgotPassword() {

  }

  goToSignup() {
    this.router.navigate(['/signup'])
  }

}
