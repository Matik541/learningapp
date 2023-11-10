import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/enums/enums';
import { UsersService } from 'src/app/components/auth/users.service';
import { AuthComponent } from '../auth.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    console.log(this.authForm, this.authForm.value.password);
    if (this.authForm.valid) {
      this.usersService
        .authLogin(this.authForm.value.email, this.authForm.value.password)
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
