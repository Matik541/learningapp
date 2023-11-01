import { CallError, User } from 'src/app/enums/enums';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @Input() class: string[] = [];

  error: CallError | null = null;
  hide: boolean = true;

  authForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder
  ) {
    this.authForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  register() {
    if (this.authForm.valid) {
      this.usersService.authRegister(
        this.authForm.get('userName')?.value,
        this.authForm.get('email')?.value,
        this.authForm.get('password')?.value
      ).subscribe((result: User | CallError) => {
        // if result type is CallError then set this.error to result
        // else set this.error to null
        if (result instanceof CallError) {
          this.error = result;
        };
      })
      .unsubscribe()
    }
    else {
      console.log(this.authForm)

    }
  }
}
