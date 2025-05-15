import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from '../spinner.component';

describe('SpinnerComponent', () => {
	let component: SpinnerComponent;
	let fixture: ComponentFixture<SpinnerComponent>;
	let spinner: HTMLElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SpinnerComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SpinnerComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		// Default should not show
		spinner = fixture.debugElement.nativeElement.querySelector('.spinner');
		expect(spinner).toBeNull();
	});

	it('should show', () => {
		fixture.componentRef.setInput('loading', true);
		fixture.detectChanges();
		spinner = fixture.debugElement.nativeElement.querySelector('.spinner');
		expect(spinner).toBeTruthy();
	});

	it('should NOT show', () => {
		fixture.componentRef.setInput('loading', false);
		fixture.detectChanges();
		spinner = fixture.debugElement.nativeElement.querySelector('.spinner');
		expect(spinner).toBeNull();
	});
});
