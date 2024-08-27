import { Component, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { FormNodeViewTypes } from '../../services/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
	selector: '[app-view-list-item]',
	templateUrl: './view-list-item.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: ViewListItemComponent,
			multi: true,
		},
	],
	styleUrls: ['./view-list-item.component.scss'],
})
export class ViewListItemComponent extends BaseControlComponent {
	customFormControlInjector?: Injector;

	get formNodeViewTypes(): typeof FormNodeViewTypes {
		return FormNodeViewTypes;
	}

	get displayAsRow() {
		return !(this.viewType === this.formNodeViewTypes.FULLWIDTH || this.viewType === this.formNodeViewTypes.CUSTOM);
	}

	override ngAfterContentInit(): void {
		super.ngAfterContentInit();
		this.createCustomFormControlInjector();
	}

	createCustomFormControlInjector() {
		this.customFormControlInjector = Injector.create({
			providers: [{ provide: NgControl, useValue: { control: this.control } }],
			parent: this.injector,
		});
	}
}
