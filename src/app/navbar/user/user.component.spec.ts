import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUserComponent } from './user.component';

describe('UserComponent', () => {
  let component: NavbarUserComponent;
  let fixture: ComponentFixture<NavbarUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
