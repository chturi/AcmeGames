import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceAdmin implements CanActivate{

  constructor(private router: Router,
              private jwtHelper: JwtHelperService,
              ) { }


  canActivate() {
    const token = localStorage.getItem("jwt");
    
    const userRole = this.jwtHelper.decodeToken(token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if(token && !this.jwtHelper.isTokenExpired(token) && userRole == "Admin")
      return true;
    
    this.router.navigate(["login"])
    
    return false;

  }

}
