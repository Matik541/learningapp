import { UsersService } from './users.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  constructor( 
    public dialogRef: MatDialogRef<AuthComponent>,
    private usersService: UsersService,
  ) { 
    this.usersService.dialogRef = this.dialogRef;
  }
}
