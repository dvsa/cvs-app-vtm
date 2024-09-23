import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
	selector: 'app-control-errors',
	templateUrl: './control-errors.component.html',
})
export class ControlErrorsComponent {
	for = input.required<string>();
	controlContainer = inject(ControlContainer);
	control = computed(() => this.controlContainer.control?.get(this.for()));
	error = computed(() => Object.values(this.control()?.errors || {})[0]);
}
