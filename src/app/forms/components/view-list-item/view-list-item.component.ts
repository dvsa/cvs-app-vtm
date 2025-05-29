import { AsyncPipe, DatePipe, NgClass, NgComponentOutlet } from '@angular/common';
import { Component, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { FormNodeViewTypes } from '@services/dynamic-forms/dynamic-form.types';
import { NumberPlateComponent } from '../../../components/number-plate/number-plate.component';
import { DefaultNullOrEmpty } from '../../../pipes/default-null-or-empty/default-null-or-empty.pipe';
import { GetControlLabelPipe } from '../../../pipes/get-control-label/get-control-label.pipe';
import { RefDataDecodePipe } from '../../../pipes/ref-data-decode/ref-data-decode.pipe';
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
	imports: [
		NgClass,
		NumberPlateComponent,
		NgComponentOutlet,
		AsyncPipe,
		DatePipe,
		DefaultNullOrEmpty,
		RefDataDecodePipe,
		GetControlLabelPipe,
	],
})
export class ViewListItemComponent extends BaseControlComponent {
	readonly ABANDON_REASONS_REGEX = new RegExp('\\. (?<!\\..\\. )');

	customFormControlInjector?: Injector;

	get formNodeViewTypes(): typeof FormNodeViewTypes {
		return FormNodeViewTypes;
	}

	get displayAsRow() {
		const viewType = this.viewType();
		return !(viewType === this.formNodeViewTypes.FULLWIDTH || viewType === this.formNodeViewTypes.CUSTOM);
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
