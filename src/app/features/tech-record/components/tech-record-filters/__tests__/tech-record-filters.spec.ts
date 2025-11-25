import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, NgControl } from '@angular/forms';
import { FieldErrorMessageComponent } from '@forms/components/field-error-message/field-error-message.component';
import { TechRecordFiltersComponent } from '../tech-record-filters.component';

describe('TechRecordFiltersComponent', () => {
	let component: TechRecordFiltersComponent;
	let fixture: ComponentFixture<TechRecordFiltersComponent>;

	beforeEach(async () => {
		const NG_CONTROL_PROVIDER = {
			provide: NgControl,
			useClass: class extends NgControl {
				control = new FormControl('');
				viewToModelUpdate() {}
			},
		};

		await TestBed.configureTestingModule({
			imports: [FormsModule, TechRecordFiltersComponent, FieldErrorMessageComponent],
		})
			.overrideComponent(TechRecordFiltersComponent, { add: { providers: [NG_CONTROL_PROVIDER] } })
			.compileComponents();

		fixture = TestBed.createComponent(TechRecordFiltersComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('tags', ['Plates', 'Required', 'ADR']);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should should add tags to its value when toggled on', () => {
		fixture.componentRef.setInput('tags', ['Plates', 'Required', 'ADR']);
		fixture.detectChanges();
		fixture.componentInstance.toggle('Plates');
		fixture.componentInstance.toggle('Required');
		expect(component.value()).toEqual(['Plates', 'Required']);
	});

	it('should should remove tags from its value when toggled off', () => {
		fixture.componentRef.setInput('tags', ['Plates', 'Required', 'ADR']);
		fixture.componentRef.setInput('value', ['Plates', 'Required', 'ADR']);
		fixture.detectChanges();
		fixture.componentInstance.toggle('Plates');
		fixture.componentInstance.toggle('Required');
		expect(component.value()).toEqual(['ADR']);
	});
});
