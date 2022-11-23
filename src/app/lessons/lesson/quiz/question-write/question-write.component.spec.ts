import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionWriteComponent } from './question-write.component';

describe('QuestionWriteComponent', () => {
  let component: QuestionWriteComponent;
  let fixture: ComponentFixture<QuestionWriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionWriteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
