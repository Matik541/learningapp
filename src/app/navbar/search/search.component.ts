import { Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'nav-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class NavbarSearchComponent implements OnInit {
  queryForm: FormGroup = this.formBuilder.group({
    query: '',
  })

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.router.navigate(['/search'], {
      queryParams: {
        query: this.queryForm.value.query,
      },
    })
  }
}
