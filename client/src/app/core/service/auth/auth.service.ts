import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignupRequest} from "../../dto/signup-request.model";
import {Observable} from "rxjs";
import {LoginRequest} from "../../dto/login-request.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  register(data: SignupRequest): Observable<any> {
    return this.http.post(this.apiUrl + '/signup', data);
  }

  login(data: LoginRequest): Observable<any> {
    return this.http.post(this.apiUrl + '/login', data);
  }


}
