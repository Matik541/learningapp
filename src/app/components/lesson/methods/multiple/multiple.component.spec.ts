import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleComponent } from './multiple.component';

describe('MultipleComponent', () => {
  let component: MultipleComponent;
  let fixture: ComponentFixture<MultipleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleComponent]
    });
    fixture = TestBed.createComponent(MultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
