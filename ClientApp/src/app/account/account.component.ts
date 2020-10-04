import { ChangeEmailDialogComponent } from './../change-email-dialog/change-email-dialog.component';
import { NotificationService } from './../services/notification.service';
import { UsersService } from './../services/users.service';
import { GamesService } from './../services/games.service';
import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '../services/authentication.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';

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
  updateUserLoading: boolean;
  getGamesLoading: boolean; 
 
  constructor(private fb: FormBuilder,
              private gameService: GamesService,
              private userService: UsersService,
              private notificationService: NotificationService,
              private ngZone: NgZone,
              private changePasswordDialog: MatDialog,
              private changeEmailDialog: MatDialog) { }

  ngOnInit(): void {

    this.getUserFromClaims();

    this.accountForm = this.fb.group({
      emailAddress : new FormControl(this.user.emailAdress,[Validators.required]),
      firstName : new FormControl(this.user.firstName,[Validators.required]),
      lastName : new FormControl(this.user.lastName,[Validators.required]),
    });

    this.accountForm.disable();
  

    this.gameService.getUserGames(this.user.userAccountId)
    .subscribe(results => {
      this.userGames = (results as Game[]);
    });

    this.accountForm.valueChanges.subscribe(() => {this.onFormValueChange()})  

    
    
  }


  private getUserFromClaims () {

    this.user.userAccountId = JSON.parse(localStorage.getItem("currentUser")).userAccountId;
    this.user.firstName = JSON.parse(localStorage.getItem("currentUser")).firstName;
    this.user.lastName = JSON.parse(localStorage.getItem("currentUser")).lastName;
    this.user.emailAdress = JSON.parse(localStorage.getItem("currentUser")).emailAdress;
    this.user.role = JSON.parse(localStorage.getItem("currentUser")).role;
    this.user.dateOfBirth = JSON.parse(localStorage.getItem("currentUser")).dateOfBirth;
    console.log(this.user)

  }

  updateUserDetails() {
    this.updateUserLoading = true;

    this.userService.updateUserDetails(this.user)
    .subscribe(
      success =>{
        this.notificationService.showSuccess('Your User Details was Successfully updated!')
        this.updateUserLoading = false;
        this.accountForm.disable();
      })

  }

  updateUserPassword() {
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.user.userAccountId;
    dialogConfig.panelClass = 'custom-dialog-container' ;
      
    this.ngZone.run(() => {
       this.changePasswordDialog.open(ChangePasswordDialogComponent,dialogConfig);
    });  

  }

  updateUserEmail() {
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.user.userAccountId;
    dialogConfig.panelClass = 'custom-dialog-container' ;
      
    this.ngZone.run(() => {
       this.changeEmailDialog.open(ChangeEmailDialogComponent,dialogConfig);
    });  

  }

  private onFormValueChange () 
  { 
    //Assign data from form to user object
    for (const key in this.accountForm.controls) {
        const control = this.accountForm.get(key);
        this.user[key] = control.value;
    }

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
