import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from 'src/app/services/users.service';
import { AdminsService } from 'src/app/services/admins.service';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit {

  editUserForm: FormGroup;
  submitted: boolean;
  loading: boolean;
  userDataLoading: boolean;
  hide: boolean = true;
  usernameExsist = false;
  isEmailError = false;
  emailError: string;
  userResource: any = {};
  
  constructor(private dialogRef: MatDialogRef<EditUserDialogComponent>,
              public fb: FormBuilder,
              private userService : UsersService,
              private adminService: AdminsService,
              private notificationService : NotificationService,
              @Inject(MAT_DIALOG_DATA) data) 
      {
      this.userResource = data; 
      } 

  ngOnInit(): void {

    //Assign form loading state for spinner
    this.userDataLoading = true;

    //Initilizing reactive form
    this.editUserForm = this.fb.group({
      emailAddress : new FormControl(null,[Validators.required,Validators.email]),
      firstName : new FormControl(null,[Validators.required]),
      lastName : new FormControl(null,[Validators.required]),
      dateOfBirth : new FormControl(null,[Validators.required]),
      role : new FormControl(null,[Validators.required]),
      userAccountId:  new FormControl(null), 
    });

    //Making the get user information HTTP request and parse isAdmin to role data
    this.userService.getUserInformation(this.userResource["User Account Id"])
    .subscribe( (results: any) => {
      results.role = (results.isAdmin) ? "Admin" : "User"
      this.editUserForm.patchValue(results);
      this.userDataLoading = false;
    });

    //Make a subscription to the form allowing to update data to userResource whenever form is updated
    this.editUserForm.valueChanges.subscribe(formdata => {
      this.onFormValueChange(); 
    });

  }

//Assign data from form to userResource
  private onFormValueChange () {
    
    for (const key in this.editUserForm.controls) {
        const control = this.editUserForm.get(key);
        this.userResource[key] = control.value; 
    } 
  }

  //Submitting edit user information form
  editUserInformation() {
    this.loading = true;

    this.adminService.updateUser(this.userResource)
    .subscribe(
      success => { 
      this.notificationService.showSuccess(this.userResource.firstName + " " + this.userResource.lastName + " information was updated succefully!");
      this.dialogRef.close(true);
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
