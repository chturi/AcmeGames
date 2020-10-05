import { GamesService } from './../../services/games.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminsService } from 'src/app/services/admins.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-revoke-game-dialog',
  templateUrl: './add-revoke-game-dialog.component.html',
  styleUrls: ['./add-revoke-game-dialog.component.css']
})
export class AddRevokeGameDialogComponent implements OnInit {

  editGameForm: FormGroup;
  loading: boolean;
  gameAction;
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
        addedGame : new FormControl(null,[Validators.required]),
        revokedGame : new FormControl(null,[Validators.required]),           
      });

      
      this.gameservice.getUserGames(this.userResource.userAccountId)
        .subscribe((userGames: {}[]) => {
          this.ownedGames = userGames;

          this.gameservice.getGames()
            .subscribe((allGames: {}[]) => {
              this.allGames = allGames;

              this.notOwnedGames = this.ownedGames
                .filter(game => allGames.indexOf(game) < 0);
                this.gameDataLoading = false;
            });
        });

    }


    setGameAction(action) {
      this.gameAction = action;
    }

    addGame(){

    }

    revokeGame(){

    }

    close(){
      this.dialogRef.close();
    }

}
