import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  public loginUrl = `${environment.api}/auth/login`;

  constructor(private httpClient: HttpClient) {}

  public login(username: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { username, password };

    return this.httpClient.post<LoginResponse>(this.loginUrl, body);
  }
}
