import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly systemsEndpoint: string = "/api/users/";

  constructor(private http: HttpClient) { }

  getUserInformation(userAccountId) {

     return this.http.get(this.systemsEndpoint + userAccountId); 

  }
  
}
