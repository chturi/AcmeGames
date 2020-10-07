import { AdminsService } from './../services/admins.service';
import { AfterViewInit, Component, ViewChild, NgZone } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ResetPasswordDialogComponent } from './dialogs/reset-password-dialog/reset-password-dialog.component';
import { EditUserDialogComponent } from './dialogs/edit-user-dialog/edit-user-dialog.component';
import { AddRevokeGameDialogComponent } from './dialogs/add-revoke-game-dialog/add-revoke-game-dialog.component';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements AfterViewInit {

  displayedColumns: string[] = ["Full Name","Email Address","Role","Date of Birth","Edit User Details","Add/Revoke Game","Reset Password"];
  dataSource= new MatTableDataSource<UserData>();
  ELEMENT_DATA: UserData[] = [];
  isTableLoading = true;
  dateField = false;
  editUserBtn = false;
  passwordBtn = false;
  editGameBtn = false;

  //Initializing Pageinator and sort functionallity

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminsService,
              private ngZone: NgZone,
              private resetPasswordDialog: MatDialog,
              private editUserInformationDialog: MatDialog,
              private addremoveGameDialog: MatDialog,
              private sharedService: SharedService) { }

  ngAfterViewInit (): void {

    //Subscription to check wether user is still authenticated and updated navbar
    this.sharedService.sendVerifyEvent();

    //Get all users from DB and populate table
    this.adminService.getUsers().subscribe(
      results => { 
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;  
          this.populateTable(results);   
          this.dataSource.data = this.ELEMENT_DATA;
          this.isTableLoading = false;
      });
  }

  //Function to refresh table data
  private refreshTable() {
    this.isTableLoading = true;
    this.adminService.getUsers().subscribe(
      results => {
          this.populateTable(results); 
          this.dataSource.data = this.ELEMENT_DATA; 
          this.isTableLoading = false; 
      });
  }

  //Function to populate table from DB response
  private populateTable(users) {
    var incr= 0;
    for(let user of users) {
      this.ELEMENT_DATA[incr] = {
        "User Account Id" : user.userAccountId,
        "Full Name" : user.firstName + " " + user.lastName,
        "Email Address" : user.emailAddress,
        "Role" : (user.isAdmin) ? "Admin" : "User",
        "Date of Birth" : user.dateOfBirth,
        "Edit User Details" : true,
        "Add/Revoke Game" : true,
        "Reset Password" : true
         }        
        incr++;
    }
  }

  //Table field parsing of data, decides what format the table field should have
  tableFieldParser(fieldLabel) {
    this.dateField = false;
    this.editUserBtn = false;
    this.passwordBtn = false;
    this.editGameBtn = false;
   
    if (fieldLabel === "Date of Birth" )
      return this.dateField = true;
    else if (fieldLabel === "Add/Revoke Game")
      return this.editGameBtn = true;
    else if (fieldLabel === "Reset Password")
      return this.passwordBtn = true;
    else if (fieldLabel === "Edit User Details" )
      return this.editUserBtn = true;
    else 
      return false;   
  }

  //Open reset password dialog, user data from the same row will be sent to the dialog box
  resetPassword(element : UserData) {
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = element;
    dialogConfig.panelClass = 'custom-dialog-container' ;
    
    let dialogRef
    this.ngZone.run(() => {
      dialogRef = this.resetPasswordDialog.open(ResetPasswordDialogComponent,dialogConfig);
    });
    
    dialogRef.afterClosed()
    .subscribe(
      data => {
        if (data)
          this.refreshTable();
      });

  }

  //Open Edit user Information dialog, user data from the same row will be sent to the dialog box
  editUserInformation (element : UserData) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = element;
    dialogConfig.panelClass = 'custom-dialog-container' ;
    
    let dialogRef
    this.ngZone.run(() => {
      dialogRef = this.editUserInformationDialog.open(EditUserDialogComponent,dialogConfig);
    });
    
    dialogRef.afterClosed()
    .subscribe(
      data => {
        if (data)
          this.refreshTable();
      });
  }

//Open Add/Revoke game dialog, user data from the same row will be sent to the dialog box
  addRevokeGame (element : UserData) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = element;
    dialogConfig.panelClass = 'custom-dialog-container' ;
    
    let dialogRef
    this.ngZone.run(() => {
      dialogRef = this.addremoveGameDialog.open(AddRevokeGameDialogComponent,dialogConfig);
    });
    
    dialogRef.afterClosed()
    .subscribe(
      data => {
        if (data)
          this.refreshTable();
      });

  }
  

}

//Interface for Table row data
export interface UserData {
  "User Account Id":string,
  "Full Name": string,
  "Email Address":string,
  "Date of Birth": Date,
  "Role": string,
  "Edit User Details": boolean,
  "Add/Revoke Game": boolean,
  "Reset Password": boolean
}