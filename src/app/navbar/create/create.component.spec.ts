import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: NavbarCreateComponent;
  let fixture: ComponentFixture<NavbarCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
