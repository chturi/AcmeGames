import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly systemsEndpoint: string = "/api/login";
  
  constructor(private http: HttpClient) { }

  login (credentials) {

    return this.http.post(this.systemsEndpoint, credentials);

  }

}
