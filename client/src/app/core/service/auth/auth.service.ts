import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignupRequest} from "../../dto/signup-request.model";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {LoginRequest} from "../../dto/login-request.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';

  private userRoleSubject = new BehaviorSubject<string>('');
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: SignupRequest): Observable<any> {
    return this.http.post(this.apiUrl + '/signup', data);
  }

  login(data: LoginRequest): Observable<any> {
    return this.http.post(this.apiUrl + '/login', data).pipe(
      tap((response: any) => {
        if (response) {
          localStorage.setItem('user', JSON.stringify({
            email: response.email,
            firstname: response.firstname,
            lastname: response.lastname,
            role: response.role
          }));

          this.userRoleSubject.next(response.role || '');
        }
      })
    );
  }

  getLoggedUser(){
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
  }

}
