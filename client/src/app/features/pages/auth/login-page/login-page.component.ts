import { Component } from '@angular/core';
import {LoginFormComponent} from "../../../components/auth/login-form/login-form.component";
import {AuthService} from "../../../../core/service/auth/auth.service";
import {Router} from "@angular/router";
import {LoginRequest} from "../../../../core/dto/login-request.model";

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

  handleLogin(data: LoginRequest) {
    this.authService.login(data).subscribe({
      next: (response) => {
        console.log('Login uspešan:', response);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Login greška:', err);
        alert('Invalid email or password.');
      }
    });
  }

  forgotPassword() {

  }

  goToSignup() {
    this.router.navigate(['/signup'])
  }

}
