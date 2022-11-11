import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionMatchComponent } from './question-match.component';

describe('QuestionMatchComponent', () => {
  let component: QuestionMatchComponent;
  let fixture: ComponentFixture<QuestionMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionMatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
