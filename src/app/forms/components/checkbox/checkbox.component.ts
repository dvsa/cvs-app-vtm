import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';

@Component({
	selector: 'app-checkbox',
	templateUrl: './checkbox.component.html',
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CheckboxComponent, multi: true }],
	imports: [NgClass, FieldErrorMessageComponent, NgTemplateOutlet, FormsModule],
})
export class CheckboxComponent extends BaseControlComponent {}
