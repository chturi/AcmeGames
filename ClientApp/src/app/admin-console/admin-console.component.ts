import { AdminsService } from './../services/admins.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminsService) { }

  ngAfterViewInit (): void {
    this.adminService.getUsers().subscribe(
      results => { 
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;  
          this.populateTable(results);   
          this.dataSource.data = this.ELEMENT_DATA;
          this.isTableLoading = false;
          console.log(JSON.stringify(results))
      });
  }

  private refreshTable() {
    this.isTableLoading = true;
    this.adminService.getUsers().subscribe(
      results => {
          this.populateTable(results); 
          this.dataSource.data = this.ELEMENT_DATA; 
          this.isTableLoading = false; 
      });
  }

  private populateTable(users) {
    var incr= 0;
    for(let user of users) {
      this.ELEMENT_DATA[incr] = {
        "User Account Id" : user.userAccountId,
        "Full Name" : user.fullName,
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

  resetPassword() {


  }

  editUserInformation () {


  }

  addRevokeGame () {


  }
  

}

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