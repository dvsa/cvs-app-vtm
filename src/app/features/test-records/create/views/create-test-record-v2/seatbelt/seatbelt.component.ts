import { FormGroupFrom } from '@/src/app/models/form.model';
import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

@Component({
	selector: 'app-seatbelt',
	templateUrl: './seatbelt.component.html',
})
export class SeatbeltComponent {
	form = input.required<FormGroup<FormGroupFrom<TestResultSchema>>>();
}
