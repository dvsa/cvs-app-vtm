import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';

import { CustomDefectComponent } from './custom-defect.component';

describe('CustomDefectComponent', () => {
	let component: CustomDefectComponent;
	let fixture: ComponentFixture<CustomDefectComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			imports: [SharedModule, DynamicFormsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(CustomDefectComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
