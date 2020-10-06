import { SharedService } from './../services/shared.service';
import { Router} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit{
  isExpanded = false;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userRole: string;
  username: string;
  
  constructor(private router: Router,
              private sharedService: SharedService,
              private jwtHelper: JwtHelperService) {}

  ngOnInit() : void {
   
    this.sharedService.getVerifyEvent().subscribe(()=> {
      this.isUserAuthenticated();
    })
  }
  
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {

     localStorage.removeItem("jwt");
     this.isUserAuthenticated();
    
  }

  isUserAuthenticated() {
    const token: string = localStorage.getItem("jwt");
    
    if (token && !this.jwtHelper.isTokenExpired(token))  {
      this.isAuthenticated = true;
      this.userRole = this.jwtHelper.decodeToken(token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      this.username = this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

      if(this.userRole == "Admin")
        this.isAdmin = true;
      else
        this.isAdmin = false;

      this.router.navigate(["account"])
    } 
    else {
      this.userRole = "";
      this.username = "";
      this.isAdmin = false;
      this.isAuthenticated = false;
      this.router.navigate(["login"]);
    }  
   
  }


}
