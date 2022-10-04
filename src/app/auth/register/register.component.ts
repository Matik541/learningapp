import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../users.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<RegisterComponent>, private usersService: UsersService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(/(?=^.{10,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]),
    });
  }
  register(){
    if(this.formGroup.valid){
      this.usersService.register(this.formGroup.value.username, this.formGroup.value.email, this.formGroup.value.password).subscribe((data) => {
        console.log(data);
        this.dialogRef.close();
      });
    }
    else{
      console.log("Invalid form");
    }
  }
}