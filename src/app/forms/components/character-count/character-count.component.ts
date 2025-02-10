import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
	selector: 'app-character-count',
	templateUrl: './character-count.component.html',
})
export class CharacterCountComponent {
	for = input.required<string>();
	limit = input.required<number>();
	controlContainer = inject(ControlContainer);
	control = computed(() => this.controlContainer.control?.get(this.for()));
}
