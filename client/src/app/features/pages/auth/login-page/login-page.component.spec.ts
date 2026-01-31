import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import {AuthService} from "../../../../core/service/auth/auth.service";
import {of, throwError} from "rxjs";
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {Router} from "@angular/router";

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login when handleLogin is triggered', () => {
    const authService = TestBed.inject(AuthService);
    const loginData = { email: 'trivunic99@gmail.com', password: 'sad' };

    spyOn(authService, 'login').and.returnValue(of({ role: 'GUEST' }));

    component.handleLogin(loginData);

    expect(authService.login).toHaveBeenCalledWith(loginData);
  });

  it('should show alert when login fails', () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'login').and.returnValue(throwError(() => new Error('Invalid credentials')));
    spyOn(window, 'alert');

    component.handleLogin({ email: 'wrong@test.com', password: '123' });

    expect(window.alert).toHaveBeenCalledWith('Invalid email or password.');
  });

  it('should navigate to /profile on successful login', () => {
    const authService = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    spyOn(authService, 'login').and.returnValue(of({ role: 'GUEST' }));

    component.handleLogin({ email: 'test@test.com', password: 'sad' });

    expect(navigateSpy).toHaveBeenCalledWith(['/profile']);
  });

});
