import { AuthenticationService } from './../services/authentication.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean;
  loading: boolean;
  hide = true;


  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private authService: AuthenticationService,
              private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      emailAddress : new FormControl(null,[Validators.required]),
      password : new FormControl(null,[Validators.required])
    });
    
  }

  get form() { return this.loginForm.controls }

  login() {
    
    localStorage.removeItem("currentUser");
    localStorage.removeItem("jwt");

    const credentials = {
      'emailAddress' : this.form.emailAddress.value,
      'password' : this.form.password.value,
    }

  
    this.invalidLogin = false;
    this.loading = true;

    this.authService.login(credentials)
    .subscribe(response => { 
      
      const token = (<any>response).token;
      
      const currentUser = {
        userAccountId: this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        firstName: this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
        lastName: this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
        emailAdress: this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        role: this.jwtHelper.decodeToken(token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        dateOfBirth: this.jwtHelper.decodeToken(token)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth']
      };

      localStorage.setItem("jwt",token);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      this.invalidLogin = false;
      this.loading = false;
      this.router.navigate(["/account"]);

    }, (err: HttpErrorResponse) => 
    {
      if(err.status == 400 || err.status == 401)
        { 
          this.invalidLogin = true;
          this.loading = false;
        }
      else 
        throwError(err)
        
    });

  }


}
