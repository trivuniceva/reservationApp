import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignupRequest} from "../../dto/signup-request.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/signup';

  constructor(private http: HttpClient) {}

  register(data: SignupRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
