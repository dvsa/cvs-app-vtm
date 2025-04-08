import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { NumberPlateComponent } from '../number-plate.component';

describe('NumberPlateComponent', () => {
	let component: NumberPlateComponent;
	let fixture: ComponentFixture<NumberPlateComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NumberPlateComponent, DefaultNullOrEmpty],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NumberPlateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should format a standard vrm', () => {
		component.vrm = 'AA21AAA';
		expect(component.vrm).toBe('AA21 AAA');
	});

	it('should not format a short vrm', () => {
		component.vrm = 'A123';
		expect(component.vrm).toBe('A123');
	});

	describe('isZNumber', () => {
		it('should return true if it matches the z number format', () => {
			component.vrm = '1234567Z';
			expect(component.isZNumber(component.vrm)).toBeTruthy();
		});

		it('should return false if the Z is not present at the end', () => {
			component.vrm = '12345';
			expect(component.isZNumber(component.vrm)).toBeFalsy();
			component.vrm = '1234Z5';
			expect(component.isZNumber(component.vrm)).toBeFalsy();
		});

		it('should return false if the z number does not match the format', () => {
			component.vrm = 'A12345Z';
			expect(component.isZNumber(component.vrm)).toBeFalsy();
			component.vrm = '12+%345Z';
			expect(component.isZNumber(component.vrm)).toBeFalsy();
			component.vrm = 'Z';
			expect(component.isZNumber(component.vrm)).toBeFalsy();
		});
	});
});
