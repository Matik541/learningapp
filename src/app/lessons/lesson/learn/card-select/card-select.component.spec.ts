import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSelectComponent } from './card-select.component';

describe('CardMatchComponent', () => {
  let component: CardSelectComponent;
  let fixture: ComponentFixture<CardSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
