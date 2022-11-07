import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ErrorComponent } from './error.component'

describe('Error404Component', () => {
  let component: ErrorComponent
  let fixture: ComponentFixture<ErrorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ErrorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
