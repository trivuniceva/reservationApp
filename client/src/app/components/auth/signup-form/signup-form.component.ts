import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {SignupRequest} from "../../../core/dto/signup-request.model";

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css'
})
export class SignupFormComponent {

  signupForm: FormGroup;
  @Output() formSubmit = new EventEmitter<SignupRequest>();

  currentStep: number = 1;

  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  passwordStrengthMessage: string = '';

  message: { type: 'success' | 'error' | 'warning', text: string } | null = null;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      userRole: ['GUEST', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.signupForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordStrength(value);
    });
  }

  showMessage(type: 'success' | 'error' | 'warning', text: string) {
    this.message = { type, text };
    setTimeout(() => this.message = null, 5000);
  }

  checkPasswordStrength(value: string) {
    if (!value) {
      this.passwordStrengthMessage = '';
      return;
    }
    const regexStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const regexMedium = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (regexStrong.test(value)) {
      this.passwordStrength = 'strong';
      this.passwordStrengthMessage = 'Strong password';
    } else if (regexMedium.test(value)) {
      this.passwordStrength = 'medium';
      this.passwordStrengthMessage = 'Medium strength password';
    } else {
      this.passwordStrength = 'weak';
      this.passwordStrengthMessage = 'Weak password';
    }
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.showMessage('warning', 'Please fill in all fields correctly.');
      return;
    }

    if (this.signupForm.hasError('mismatch')) {
      this.showMessage('warning', 'Passwords do not match.');
      return;
    }

    if (this.passwordStrength === 'weak') {
      this.showMessage('warning', 'Password is too weak.');
      return;
    }

    this.formSubmit.emit(this.signupForm.value);
  }
}
