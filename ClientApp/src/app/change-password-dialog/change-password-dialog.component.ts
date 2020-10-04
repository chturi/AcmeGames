import { NotificationService } from './../services/notification.service';
import { UsersService } from './../services/users.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmedValidator } from '../validators/Confirmed.validators';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {

  changePasswordForm: FormGroup;
  submitted: boolean;
  loading: boolean;
  hide: boolean = true;
  usernameExsist = false;
  passwordResource: any = {
    userAccountId: null,
    currentPassword: null,
    password: null,
  };
  
  

  constructor(private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
              public fb: FormBuilder,
              private jwtHelper : JwtHelperService,
              private userService : UsersService,
              private notificationService : NotificationService,
              @Inject(MAT_DIALOG_DATA) data) 
      {
      this.passwordResource.userAccountId = data; 
      } 

  ngOnInit(): void {

    this.changePasswordForm = this.fb.group({
      currentPassword: new FormControl(null,[Validators.required]),
      password : new FormControl(null,[Validators.required]),
      confirmPassword : new FormControl(null,),
    }, {
      validators: ConfirmedValidator('password','confirmPassword')
    });

    this.changePasswordForm.valueChanges.subscribe(formdata => {
      this.onFormValueChange(); 
    });

  }

  get form() { return this.changePasswordForm.controls }


  changePassword() {
    console.log(this.passwordResource);
    this.loading = true;
    this.userService.updateUserPassword(this.passwordResource)
    .subscribe(
      success => {
        this.notificationService.showSuccess("Your Password changed successfully!")
      }
    )
    
    
    this.loading = false;
  }

  close(){
    this.dialogRef.close();
  }

  private onFormValueChange () {
    //Assign data from form to system object
    for (const key in this.changePasswordForm.controls) {
      if (key != "confirmPassword") {
        const control = this.changePasswordForm.get(key);
        this.passwordResource[key] = control.value;
      }
      
    } 
  }
  

}
