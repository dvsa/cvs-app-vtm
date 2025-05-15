import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldWarningMessageComponent } from '../field-warning-message.component';

describe('FieldWarningMessageComponent', () => {
	let component: FieldWarningMessageComponent;
	let fixture: ComponentFixture<FieldWarningMessageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FieldWarningMessageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FieldWarningMessageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
