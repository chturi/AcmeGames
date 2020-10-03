import { AuthenticationService } from './../services/authentication.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean;
  submitted: boolean;
  loading: boolean;
  hide = true;


  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private authService: AuthenticationService,
              private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      username : new FormControl(null,[Validators.required]),
      password : new FormControl(null,[Validators.required])
    });
    
  }

  get form() { return this.loginForm.controls }

  login() {

    const credentials = {
      'username' : this.form.username.value,
      'password' : this.form.password.value,
    }

    this.invalidLogin = false;
    this.loading = true;

    this.authService.login(credentials)
    .subscribe(response => { 
      
      const token = (<any>response).token;
      
      const currentUser = {
        username: this.jwtHelper.decodeToken(token)['username'], 
        role: this.jwtHelper.decodeToken(token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
      };

      localStorage.setItem("jwt",token);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      this.invalidLogin = false;
      this.loading = false;

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
