import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupFormComponent } from './signup-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SignupRequest} from "../../../core/dto/signup-request.model";

describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignupFormComponent,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit signup data when form is valid', () => {
    spyOn(component.formSubmit, 'emit');

    const mockUser: SignupRequest = {
      email: 'test@example.com',
      password: 'Sad123!',
      confirmPassword: 'Sad123!',
      firstName: 'nikolina',
      lastName: 'trivunic',
      address: 'adresa',
      phone: '065123456',
      userRole: 'GUEST'
    };

    component.signupForm.setValue(mockUser);
    component.passwordStrength = 'strong';
    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith(mockUser);

  })

  it('should NOR emit signup data if form is invalid', () => {
    spyOn(component.formSubmit, 'emit');

    component.signupForm.patchValue({email: 'los-mejl@@@'});
    component.onSubmit();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  })



});
