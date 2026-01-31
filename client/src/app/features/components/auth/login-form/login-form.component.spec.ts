import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
import {AuthService} from "../../../../core/service/auth/auth.service";
import {Router} from "@angular/router";
import {of} from "rxjs";

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit login data when login() is called', () => {
    spyOn(component.onLogin, 'emit');

    const loginData = { email: 'trivunic99@gmail.com', password: 'sad' };

    component.loginForm.setValue(loginData);

    component.login();

    expect(component.onLogin.emit).toHaveBeenCalledWith(loginData);
  });
});
