import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWriteComponent } from './card-write.component';

describe('CardWriteComponent', () => {
  let component: CardWriteComponent;
  let fixture: ComponentFixture<CardWriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardWriteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
