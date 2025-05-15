import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseBannerComponent } from '../phase-banner.component';

describe('PhaseBannerComponent', () => {
	let component: PhaseBannerComponent;
	let fixture: ComponentFixture<PhaseBannerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PhaseBannerComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PhaseBannerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
