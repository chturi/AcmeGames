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
      
      this.gameDataLoading = true;
      
      this.editGameForm = this.fb.group({
        adding : new FormGroup ({
          addedGame : new FormControl(null,[Validators.required])
        }),
        revoking : new FormGroup ({
          revokedGame : new FormControl(null,[Validators.required]),
        })           
      });

      
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


    setGameAction(action) {
      this.gameAction = action;
    }

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

    close(){
      this.dialogRef.close();
    }

}
