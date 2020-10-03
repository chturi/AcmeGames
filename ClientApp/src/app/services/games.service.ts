import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private readonly systemsEndpoint: string = "/api/games/";

  constructor(private http: HttpClient) { }

  getUserGames(userAccountId) {

     return this.http.get(this.systemsEndpoint + userAccountId); 

  }

}
