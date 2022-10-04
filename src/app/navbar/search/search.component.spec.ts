import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSearchComponent } from './search.component';

describe('NavbarSearchComponent', () => {
  let component: NavbarSearchComponent;
  let fixture: ComponentFixture<NavbarSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
