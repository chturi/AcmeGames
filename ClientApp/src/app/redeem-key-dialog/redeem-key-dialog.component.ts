import { GamesService } from './../services/games.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ChangeEmailDialogComponent } from '../change-email-dialog/change-email-dialog.component';
import { NotificationService } from '../services/notification.service';
import { UsersService } from '../services/users.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-redeem-key-dialog',
  templateUrl: './redeem-key-dialog.component.html',
  styleUrls: ['./redeem-key-dialog.component.css']
})
export class RedeemKeyDialogComponent implements OnInit {

  redeemKeyForm: FormGroup;
  submitted: boolean;
  loading: boolean;
  hide: boolean = true;
  usernameExsist = false;
  key: any = {
    keyId : null
  } 
  
  

  constructor(private dialogRef: MatDialogRef<RedeemKeyDialogComponent>,
              public fb: FormBuilder,
              private gameService : GamesService,
              private notificationService : NotificationService,
              ) {}
      

  ngOnInit(): void {

    this.redeemKeyForm = this.fb.group({
      keyId: new FormControl(null,[Validators.required])
    });

    this.redeemKeyForm.valueChanges.subscribe(formdata => {
      this.onFormValueChange(); 
    });
  }

  private onFormValueChange () {
    //Assign data from form to system object
    for (const key in this.redeemKeyForm.controls) {
      {
        const control = this.redeemKeyForm.get(key);
        this.key[key] = control.value;
      } 
    } 
  }

  redeemKey() {
    this.loading = true;

    this.gameService.redeemUserGame(this.key)
    .subscribe( 
      success => {this.notificationService.showSuccess("Your new game has been added!")
      this.dialogRef.close(true);
      },
      (error: HttpErrorResponse) => {
      this.notificationService.showError("Error: " + error.error);
      this.loading = false;
    }); 

  }

  close(){
    this.dialogRef.close();
  }





}
