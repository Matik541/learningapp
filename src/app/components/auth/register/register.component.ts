import { ActivatedRoute, Router } from '@angular/router';
import { CallError, User } from 'src/app/enums/enums';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/components/auth/users.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthComponent } from '../auth.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @Input() class: string[] = [];

  error: any = null;
  hide: boolean = true;

  authForm: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
  ) {
    this.authForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          // Validators.pattern(
          //   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,}$'/
          // ),
        ],
      ],
    });
  }

  register() {
    if (this.authForm.valid) {
      this.usersService
        .authRegister(
          this.authForm.value.userName,
          this.authForm.value.email,
          this.authForm.value.password
        )
        .subscribe((result: User | any) => {
          if (result.statusCode) {
            this.error = result;
            return;
          }

          this.error = null;

          this.usersService.close();
        });
    }
  }
}
