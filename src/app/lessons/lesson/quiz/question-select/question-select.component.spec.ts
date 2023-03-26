import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSelectComponent } from './question-select.component';

describe('QuestionMatchComponent', () => {
  let component: QuestionSelectComponent;
  let fixture: ComponentFixture<QuestionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
