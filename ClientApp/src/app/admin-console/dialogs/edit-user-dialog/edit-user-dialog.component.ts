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

    this.userDataLoading = true;

    this.editUserForm = this.fb.group({
      emailAddress : new FormControl(null,[Validators.required]),
      firstName : new FormControl(null,[Validators.required]),
      lastName : new FormControl(null,[Validators.required]),
      dateOfBirth : new FormControl(null,[Validators.required]),
      role : new FormControl(null,[Validators.required]),
      userAccountId:  new FormControl(null), 
    });

    this.userService.getUserInformation(this.userResource["User Account Id"])
    .subscribe( (results: any) => {
      results.role = (results.isAdmin) ? "Admin" : "User"
      this.editUserForm.patchValue(results);
      this.userDataLoading = false;
    })

    this.editUserForm.valueChanges.subscribe(formdata => {
      this.onFormValueChange(); 
    });

  }


  private onFormValueChange () {
    //Assign data from form to User object
    for (const key in this.editUserForm.controls) {
        const control = this.editUserForm.get(key);
        this.userResource[key] = control.value; 
    } 
  }

  editUserInformation() {
    this.loading = true;

    this.adminService.updateUser(this.userResource)
    .subscribe(
      success => { 
      this.notificationService.showSuccess(this.userResource.firstName + " " + this.userResource.lastName + " information was updated succefully!");
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
