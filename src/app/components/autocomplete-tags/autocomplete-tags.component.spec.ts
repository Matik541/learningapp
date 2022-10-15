import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteTagsComponent } from './autocomplete-tags.component';

describe('AutocompleteTagsComponent', () => {
  let component: AutocompleteTagsComponent;
  let fixture: ComponentFixture<AutocompleteTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteTagsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
