import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminsService } from 'src/app/services/admins.service';
import { NotificationService } from 'src/app/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GamesService } from 'src/app/services/games.service';

@Component({
  selector: 'app-add-revoke-game-dialog',
  templateUrl: './add-revoke-game-dialog.component.html',
  styleUrls: ['./add-revoke-game-dialog.component.css']
})
export class AddRevokeGameDialogComponent implements OnInit {

  editGameForm: FormGroup;
  loading: boolean;
  gameAction = "ADD";
  hide: boolean = true;
  usernameExsist = false;
  userResource: any = {};
  ownedGames: {}[] = [{}];
  allGames: {}[] = [{}];
  notOwnedGames: {}[] = [{}];
  gameDataLoading: boolean


  constructor(private dialogRef: MatDialogRef<AddRevokeGameDialogComponent>,
    public fb: FormBuilder,
    private adminService : AdminsService,
    private gameservice : GamesService,
    private notificationService : NotificationService,
    @Inject(MAT_DIALOG_DATA) data) 
    {
      this.userResource = {
        userAccountId: data["User Account Id"],
        fullName: data["Full Name"],
        password: null,
      } 
    } 


    ngOnInit(): void {

      //Assign form loading state for spinner
      this.gameDataLoading = true;
      
      //Initilizing reactive form
      this.editGameForm = this.fb.group({
        adding : new FormGroup ({
          addedGame : new FormControl(null,[Validators.required])
        }),
        revoking : new FormGroup ({
          revokedGame : new FormControl(null,[Validators.required]),
        })           
      });

      //Making the get games HTTP request and seperet user currently owned games and not owned
      this.gameservice.getUserGames(this.userResource.userAccountId)
        .subscribe((userGames: {}[]) => {
          this.ownedGames = userGames;

          this.gameservice.getGames()
            .subscribe((allGames: {}[]) => {
              this.allGames = allGames;
              
              this.notOwnedGames = this.allGames
                .filter(game => !this.ownedGames.some(a=> a['gameId'] === game['gameId']));

                this.gameDataLoading = false;
            });
        });

    }

    //ADD or REVOKE game state change by radio button
    setGameAction(action) {
      this.gameAction = action;

    }

    //Adding game submission
    addGame() {
      this.loading = true;

      var ownershipResource = {
        gameId: this.editGameForm.get("adding.addedGame").value,
        userAccountId: this.userResource.userAccountId,
      }

      this.adminService.addUserGame(ownershipResource)
      .subscribe(
        success => { 
        this.notificationService.showSuccess("Game was successfully added to " + this.userResource.fullName);
        this.dialogRef.close(true);
      },
      (error: HttpErrorResponse) => {
        this.notificationService.showError("Error: " + error.error);
        this.loading = false;
      }); 

    }

    //Revoke game submission
    revokeGame() {
      this.loading = true;

      var ownershipResource = {
        gameId: this.editGameForm.get("revoking.revokedGame").value,
        userAccountId: this.userResource.userAccountId,
      }

      this.adminService.revokeUserGame(ownershipResource)
      .subscribe(
        success => { 
        this.notificationService.showSuccess("Game was succefully revoked from " + this.userResource.fullName);
        this.dialogRef.close(true);
      },
      (error: HttpErrorResponse) => {
        this.notificationService.showError("Error: " + error.error);
        this.loading = false;
      }); 

    }

    //Close Dialog
    close(){
      this.dialogRef.close();
    }

}
