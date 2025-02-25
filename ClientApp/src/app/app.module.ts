import { AuthInterceptorService } from './services/auth-interceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt'

//Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';



//Angular Components
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountComponent } from './account/account.component';
import { ChangePasswordDialogComponent } from './account/dialogs/change-password-dialog/change-password-dialog.component';
import { ChangeEmailDialogComponent } from './account/dialogs/change-email-dialog/change-email-dialog.component';
import { RedeemKeyDialogComponent } from './account/dialogs/redeem-key-dialog/redeem-key-dialog.component';
import { AdminConsoleComponent } from './admin-console/admin-console.component';
import { ResetPasswordDialogComponent } from './admin-console/dialogs/reset-password-dialog/reset-password-dialog.component';
import { EditUserDialogComponent } from './admin-console/dialogs/edit-user-dialog/edit-user-dialog.component';
import { AddRevokeGameDialogComponent } from './admin-console/dialogs/add-revoke-game-dialog/add-revoke-game-dialog.component';
import { AuthGuardService } from './guards/auth-guard';
import { AuthGuardServiceAdmin } from './guards/auth-guard-admin';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    AccountComponent,
    ChangePasswordDialogComponent,
    ChangeEmailDialogComponent,
    RedeemKeyDialogComponent,
    AdminConsoleComponent,
    ResetPasswordDialogComponent,
    EditUserDialogComponent,
    AddRevokeGameDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatExpansionModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    FlexLayoutModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatMenuModule,
    MatDialogModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: 'account', component: AccountComponent, canActivate: [AuthGuardService]},
      { path: 'admin-console', component: AdminConsoleComponent, canActivate: [AuthGuardServiceAdmin]},
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:56653"],
        disallowedRoutes: []
      }
    }),
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }},
    {provide: MatDialogTitle, useValue: {}},
    {provide: MatDialogRef, useValue: {}},
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
