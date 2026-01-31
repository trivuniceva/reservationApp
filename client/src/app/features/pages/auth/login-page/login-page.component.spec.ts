import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import {AuthService} from "../../../../core/service/auth/auth.service";
import {of} from "rxjs";
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";

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

});
