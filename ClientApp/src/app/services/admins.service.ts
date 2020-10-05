import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {

  private readonly systemsEndpoint: string = "/api/admin/";

  constructor(private http: HttpClient) { }

  getUsers() {

     return this.http.get(this.systemsEndpoint + "users"); 

  }

 

}