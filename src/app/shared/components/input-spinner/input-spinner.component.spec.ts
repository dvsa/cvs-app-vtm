import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSpinnerComponent } from './input-spinner.component';

describe('InputSpinnerComponent', () => {
	let component: InputSpinnerComponent;
	let fixture: ComponentFixture<InputSpinnerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [InputSpinnerComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(InputSpinnerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
