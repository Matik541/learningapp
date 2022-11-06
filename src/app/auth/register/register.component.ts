import { MatSnackBar } from '@angular/material/snack-bar'
import { Component, OnInit, Optional } from '@angular/core'
import { UsersService } from '../../users.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  hide = true
  formGroup: FormGroup

  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    private usersService: UsersService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.formGroup = new FormGroup({
      userName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /(?=^.{10,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
        ),
      ]),
    })
  }
  register() {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value)
      this.usersService
        .register(
          this.formGroup.value.userName,
          this.formGroup.value.email,
          this.formGroup.value.password
        )
        .subscribe((logged) => {
          if (logged) {
            this.dialogRef.close()
            this.usersService.snackBar('Registered', 'OK')
          } else this.usersService.snackBar('Invalid register', 'Close')
        })
    } else this.usersService.snackBar('Invalid form', 'Close')
  }
}
