import { Router, RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  isAuthenticated: boolean;
  
  constructor(private router: Router) {}

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {

     localStorage.removeItem("jwt");
     localStorage.removeItem("currentUser");
     this.router.navigate([""]);
    
  }


}
