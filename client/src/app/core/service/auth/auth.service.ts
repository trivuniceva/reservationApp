import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignupRequest} from "../../dto/signup-request.model";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {LoginRequest} from "../../dto/login-request.model";
import {isPlatformBrowser} from "@angular/common";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';
  private userRoleSubject = new BehaviorSubject<string>('');
  userRole$ = this.userRoleSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.userRoleSubject.next(user.role);
      }
    }
  }
  register(data: SignupRequest): Observable<any> {
    return this.http.post(this.apiUrl + '/signup', data);
  }

  login(data: LoginRequest): Observable<any> {
    return this.http.post(this.apiUrl + '/login', data).pipe(
      tap((response: any) => {
        if (response) {
          localStorage.setItem('user', JSON.stringify({
            id: response.id,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            role: response.role
          }));

          this.userRoleSubject.next(response.role || '');
        }
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
    }

    this.userRoleSubject.next('');

    this.router.navigate(['/login']);
  }

  getUserInfo() {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    }

    return null;
  }
}
