import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionChooseComponent } from './question-choose.component';

describe('QuestionChooseComponent', () => {
  let component: QuestionChooseComponent;
  let fixture: ComponentFixture<QuestionChooseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionChooseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionChooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
