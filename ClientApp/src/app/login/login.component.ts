import { AuthenticationService } from './../services/authentication.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

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
              private sharedService: SharedService,
              private router: Router,
              private authService: AuthenticationService,
              ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      emailAddress : new FormControl(null,[Validators.required]),
      password : new FormControl(null,[Validators.required])
    });
    
  }

  get form() { return this.loginForm.controls }

  login() {
 
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
      localStorage.setItem("jwt",token);
     
      this.invalidLogin = false;
      this.loading = false;
      this.sharedService.sendVerifyEvent();
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
