import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../users.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<LoginComponent>, private usersService: UsersService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login(){
    if(this.formGroup.valid){
      this.usersService.login(this.formGroup.value.email, this.formGroup.value.password)
      .subscribe((logged) => {
        if(logged){
          this.dialogRef.close();
        }
        else{
          console.log("Invalid login");
        }
      });
    }
    else{
      console.log("Invalid form");
    }
  }
}
