import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../services/notification.service';
import { UsersService } from '../../../services/users.service';
import { ConfirmedValidator } from '../../../validators/Confirmed.validators';

@Component({
  selector: 'app-change-email-dialog',
  templateUrl: './change-email-dialog.component.html',
  styleUrls: ['./change-email-dialog.component.css']
})
export class ChangeEmailDialogComponent implements OnInit {

  changeEmailForm: FormGroup;
  submitted: boolean;
  loading: boolean;
  hide: boolean = true;
  usernameExsist = false;
  isEmailError = false;
  emailError: string;
  emailResource: any = {
    userAccountId: null,
    password: null,
    emailAddress: null,
  };
  
  

  constructor(private dialogRef: MatDialogRef<ChangeEmailDialogComponent>,
              public fb: FormBuilder,
              private userService : UsersService,
              private notificationService : NotificationService,
              @Inject(MAT_DIALOG_DATA) data) 
      {
      this.emailResource.userAccountId = data; 
      } 

  ngOnInit(): void {

    //Initilizing reactive form and add custom validators
    this.changeEmailForm = this.fb.group({
      emailAddress: new FormControl(null,[Validators.required,Validators.email]),
      confirmEmailAddress : new FormControl(null,[Validators.required]),
      password : new FormControl(null,[Validators.required]),
    }, {
      validators: ConfirmedValidator('emailAddress','confirmEmailAddress')
    });

    //Make a subscription to the form allowing to update data to emailReousrce whenever form is updated
    this.changeEmailForm.valueChanges.subscribe(formdata => {
      this.onFormValueChange(); 
    });

  }

  //Assign data from form to emailResource 
  private onFormValueChange () {
    
    for (const key in this.changeEmailForm.controls) {
      if (key != "confirmEmailAddress") {
        const control = this.changeEmailForm.get(key);
        this.emailResource[key] = control.value;
      }
      
    } 
  }

  //Submitting Change Email form
  changeEmail() {
    
    this.loading = true;
    
    this.userService.updateUserEmail(this.emailResource)
    .subscribe(
      success => {
        this.notificationService.showSuccess("Your Email changed successfully!")
        this.dialogRef.close(this.emailResource.emailAddress);
      },
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.isEmailError = true;
          this.emailError = error.error;  
        } else {
          this.notificationService.showError("Error: " + error.error);
        }
          this.loading = false;
      }); 
  }

 //close the Dialog
  close(){
    this.dialogRef.close();
  }

}
