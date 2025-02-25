import { MatDialog } from '@angular/material/dialog';
import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router,
              private jwtHelper: JwtHelperService,
              ) { }

//Route guard for basic authentication,  used for account information page, will route back to login page if user token isnt valid
  canActivate() {
    const token = localStorage.getItem("jwt");

    if(token && !this.jwtHelper.isTokenExpired(token))
      return true;
    
    this.router.navigate(["login"])
    
    return false;

  }

}
