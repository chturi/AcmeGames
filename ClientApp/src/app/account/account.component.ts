import { RedeemKeyDialogComponent } from './dialogs/redeem-key-dialog/redeem-key-dialog.component';
import { ChangeEmailDialogComponent } from './dialogs/change-email-dialog/change-email-dialog.component';
import { NotificationService } from './../services/notification.service';
import { UsersService } from './../services/users.service';
import { GamesService } from './../services/games.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from './dialogs/change-password-dialog/change-password-dialog.component';
import { SharedService } from '../services/shared.service';

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
              private jwtHelper: JwtHelperService,
              private changePasswordDialog: MatDialog,
              private changeEmailDialog: MatDialog,
              private redeemKeyDialog: MatDialog,
              private sharedService: SharedService) { }

  ngOnInit(): void {
    
    //Notfier to verify authetication and update navbar
    this.sharedService.sendVerifyEvent();
    
    this.getGamesLoading = true;
    this.getUserFromToken();

    this.accountForm = this.fb.group({
      emailAddress : new FormControl(this.user.emailAdress,[Validators.required]),
      firstName : new FormControl(this.user.firstName,[Validators.required]),
      lastName : new FormControl(this.user.lastName,[Validators.required]),
    });

    this.accountForm.disable(); 

    this.gameService.getUserGames(this.user.userAccountId)
      .subscribe(results => {
        this.userGames = (results as Game[]);
        this.getGamesLoading = false;
      });

    this.accountForm.valueChanges.subscribe(() => {this.onFormValueChange()})  
 
  }

  //Assigning user data claims in JWT token
  private getUserFromToken () {

    const token = localStorage.getItem("jwt"); 
     this.user= {
         userAccountId: this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
         firstName: this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
         lastName: this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
         emailAdress: this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
         role: this.jwtHelper.decodeToken(token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
         dateOfBirth: this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth']
       }
  }

  //Submission of Update user Details  form
  updateUserDetails() {
    
    this.updateUserLoading = true;

    this.userService.updateUserDetails(this.user)
    .subscribe(
      success =>{
        this.notificationService.showSuccess('Your User Details was Successfully updated!')
        this.updateUserLoading = false;
        this.accountForm.disable();
      }, 
      (error:HttpErrorResponse) => {
        this.updateUserLoading = false;
        this.notificationService.showError(error.error);
      });

  }

  //Open Password Dialog include user account id
  updateUserPassword() {
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.user.userAccountId;
    dialogConfig.panelClass = 'custom-dialog-container' ;
      
    this.ngZone.run(() => {
       this.changePasswordDialog.open(ChangePasswordDialogComponent,dialogConfig);
    });  

  }

  //Open update email Dialog and include user account id
  updateUserEmail() {
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.user.userAccountId;
    dialogConfig.panelClass = 'custom-dialog-container' ;
    
    let dialogRef;
    this.ngZone.run(() => {
       dialogRef = this.changeEmailDialog.open(ChangeEmailDialogComponent,dialogConfig);
    });
    dialogRef.afterClosed()
    .subscribe(
      data => {
        if (data)
          this.accountForm.get("emailAddress").setValue(data);
      }); 

  }

   //Open Redeem Key Dialog
  reedemKey() {
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-dialog-container' ;
    
    let dialogRef;
    this.ngZone.run(() => {
       dialogRef = this.redeemKeyDialog.open(RedeemKeyDialogComponent,dialogConfig);
    });
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.getGamesLoading = true;
          this.gameService.getUserGames(this.user.userAccountId)
            .subscribe(results => {
            this.userGames = (results as Game[]);
            this.getGamesLoading = false;
          });
        }
          
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

//Interface for game resource
interface Game {

  ageRestriction:number,
  gameId:number,
  name:string,
  thumbnail:string,

}

