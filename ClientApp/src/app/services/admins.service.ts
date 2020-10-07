import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//Service to call the admin controller end points
export class AdminsService {

  private readonly systemsEndpoint: string = "/api/admin/";

  constructor(private http: HttpClient) { }

  getUsers() {

     return this.http.get(this.systemsEndpoint + "users"); 

  }

  updateUser(userResource) {

    return this.http.put(this.systemsEndpoint + "users/" + userResource.userAccountId, userResource); 

 }

  resetPassword(passwordResource) {

    return this.http.put(this.systemsEndpoint + "set-password/" + passwordResource.userAccountId, passwordResource)
  
  }

  addUserGame(ownerShipResource) {

    return this.http.post(this.systemsEndpoint + "games/" + ownerShipResource.userAccountId , ownerShipResource);

  }

  revokeUserGame(ownerShipResource) {

    return this.http.put(this.systemsEndpoint + "games/" + ownerShipResource.userAccountId , ownerShipResource);

  }
 

}