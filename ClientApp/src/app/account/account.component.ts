import { UsersService } from './../services/users.service';
import { GamesService } from './../services/games.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  accountForm: FormGroup;
  invalidLogin: boolean;
  loading: boolean;
  hide = true;
  userGames: Game[];
  user: any ={}; 

  
 



  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private authService: AuthenticationService,
              private gameService: GamesService,
              private userService: UsersService,
              private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {

    this.getUserFromClaims();

    this.accountForm = this.fb.group({
      emailAddress : new FormControl(this.user.emailAdress,[Validators.required]),
      firstName : new FormControl(this.user.firstName,[Validators.required]),
      lastName : new FormControl(this.user.lastName,[Validators.required]),
      dateOfBirth : new FormControl(null,[Validators.required]),
    });

    this.gameService.getUserGames(this.user.userAccountId)
    .subscribe(results => {
      this.userGames = (results as Game[]);
     
    });

    
    
  }


  private getUserFromClaims () {

    this.user.userAccountId = JSON.parse(localStorage.getItem("currentUser")).userAccountId;
    this.user.firstName = JSON.parse(localStorage.getItem("currentUser")).firstName;
    this.user.lastName = JSON.parse(localStorage.getItem("currentUser")).lastName;
    this.user.emailAdress = JSON.parse(localStorage.getItem("currentUser")).emailAddress;
    this.user.role = JSON.parse(localStorage.getItem("currentUser")).role;

  }

}


interface Game {

  ageRestriction:number,
  gameId:number,
  name:string,
  thumbnail:string,

}

interface User {
  userAccountId:string,
  firstName:string,
  lastName:string,
  emailAdress:string,
  role:string,
  
}
