import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CustomFormControl, FormNode, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';

import { ViewCombinationComponent } from '../view-combination.component';

describe('ViewCombinationComponent', () => {
	let component: ViewCombinationComponent;
	let fixture: ComponentFixture<ViewCombinationComponent>;

	const formNode: FormNode = {
		name: 'combination',
		label: 'label',
		type: FormNodeTypes.COMBINATION,
		options: {
			leftComponentName: 'aName',
			rightComponentName: 'aName2',
			separator: ' ',
		},
		children: [],
	};

	const formGroup = new FormGroup({
		aName: new CustomFormControl({ name: 'aName', type: FormNodeTypes.CONTROL, children: [] }, ''),
		aName2: new CustomFormControl({ name: 'aName2', type: FormNodeTypes.CONTROL, children: [] }, ''),
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ViewCombinationComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewCombinationComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('formNode', formNode);
		fixture.componentRef.setInput('formGroup', formGroup);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should find the left and right components to make up the combination', () => {
		expect(component.leftComponent?.meta.name).toBe('aName');
		expect(component.rightComponent?.meta.name).toBe('aName2');
	});

	it('should render correct values', () => {
		const ddText: HTMLSpanElement = fixture.debugElement.query(By.css('span')).nativeElement;
		expect(ddText.innerHTML).toBe('- -');
		formGroup.patchValue({ aName: 'Hello', aName2: 'World' });
		fixture.detectChanges();
		expect(ddText.innerHTML).toBe('Hello World');
	});
});
