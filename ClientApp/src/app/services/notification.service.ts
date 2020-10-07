import { Injectable} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  //Service to open snackbar with curom message
  
  constructor(public snackBar: MatSnackBar) { }
  

  showSuccess(message: string): void {

    this.snackBar.open(message, 'X', {panelClass: ['snackBar']});

  }
  
  showError(message: string): void {
    
    this.snackBar.open(message, 'X', {panelClass: ['snackBarError']});
    
  }

  showUnExpectedError(message: string): void {

    this.snackBar.open("Unexpected Error: " + message, 'X', {panelClass: ['snackBarError']});

  }
}