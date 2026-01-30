import { Component } from '@angular/core';
import {SignupFormComponent} from "../../../components/auth/signup-form/signup-form.component";
import {SignupRequest} from "../../../core/dto/signup-request.model";
import {AuthService} from "../../../core/service/auth/auth.service";

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [
    SignupFormComponent

  ],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignupPageComponent {

  constructor(private authService: AuthService) {}

  handleSignup(data: SignupRequest) {
    console.log('data:', data);

    this.authService.register(data).subscribe({
      next: (response) => {
        console.log('successful reg:', response);
        alert('Registration successful! You can now log in.');
      },
      error: (err) => {
        console.error('signup err:', err);

        const errorMessage = err.error?.message || 'Something went wrong. Please try again.';
        alert(errorMessage);
      }
    });
  }
}
