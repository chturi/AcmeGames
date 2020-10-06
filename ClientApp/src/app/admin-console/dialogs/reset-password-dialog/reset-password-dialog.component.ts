import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminsService } from 'src/app/services/admins.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ConfirmedValidator } from 'src/app/validators/Confirmed.validators';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.css']
})
export class ResetPasswordDialogComponent implements OnInit {

  resetPasswordForm: FormGroup;
  submitted: boolean;
  loading: boolean;
  hide: boolean = true;
  usernameExsist = false;
  userResource: any = {};
  
  constructor(private dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
              public fb: FormBuilder,
              private adminService : AdminsService,
              private notificationService : NotificationService,
              @Inject(MAT_DIALOG_DATA) data) 
      {
        this.userResource = {
          userAccountId: data["User Account Id"],
          fullName: data["Full Name"],
          password: null,
        } 
      } 

  ngOnInit(): void {

    this.resetPasswordForm = this.fb.group({
      password : new FormControl(null,[Validators.required]),
      confirmPassword : new FormControl(null,),
    }, {
      validators: ConfirmedValidator('password','confirmPassword')
    });

    this.resetPasswordForm.valueChanges.subscribe(formdata => {
      this.onFormValueChange(); 
    });

  }

 
  resetPassword() {
    
    this.loading = true;
    
    this.adminService.resetPassword(this.userResource)
    .subscribe(
      success => {
        this.notificationService.showSuccess("Your Password changed successfully!")
        this.dialogRef.close();
      },
      (error: HttpErrorResponse) => {
        this.notificationService.showError("Error: " + error.error);
        this.loading = false;
      }); 
  }

  close(){
    this.dialogRef.close();
  }

  private onFormValueChange () {
    //Assign data from form to system object
    for (const key in this.resetPasswordForm.controls) {
      if (key != "confirmPassword") {
        const control = this.resetPasswordForm.get(key);
        this.userResource[key] = control.value;
      }
      
    } 
  }
  

}
