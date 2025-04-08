import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDefectComponent } from '../custom-defect.component';

describe('CustomDefectComponent', () => {
	let component: CustomDefectComponent;
	let fixture: ComponentFixture<CustomDefectComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CustomDefectComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CustomDefectComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
