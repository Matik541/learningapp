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
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(/(?=^.{10,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]),
    });
  }
  login(){
    if(this.formGroup.valid){
      this.usersService.login(this.formGroup.value.email, this.formGroup.value.password).subscribe((data) => {
        console.log(data);
        this.dialogRef.close();
      });
    }
    else{
      console.log("Invalid form");
    }
  }
}
