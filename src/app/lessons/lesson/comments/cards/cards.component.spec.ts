import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsCardsComponent } from './cards.component';

describe('CardsComponent', () => {
	let component: CommentsCardsComponent;
	let fixture: ComponentFixture<CommentsCardsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CommentsCardsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CommentsCardsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
