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

    this.changeEmailForm = this.fb.group({
      emailAddress: new FormControl(null,[Validators.required]),
      confirmEmailAddress : new FormControl(null,[Validators.required]),
      password : new FormControl(null,),
    }, {
      validators: ConfirmedValidator('emailAddress','confirmEmailAddress')
    });

    this.changeEmailForm.valueChanges.subscribe(formdata => {
      this.onFormValueChange(); 
    });

  }

  private onFormValueChange () {
    //Assign data from form to system object
    for (const key in this.changeEmailForm.controls) {
      if (key != "confirmEmailAddress") {
        const control = this.changeEmailForm.get(key);
        this.emailResource[key] = control.value;
      }
      
    } 
  }

  changeEmail() {
    
    this.loading = true;
    
    this.userService.updateUserEmail(this.emailResource)
    .subscribe(
      success => {
        this.notificationService.showSuccess("Your Email changed successfully!")
        this.dialogRef.close(this.emailResource.emailAddress);
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