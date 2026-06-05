import { TestService } from '@/src/app/services/test/test.service';
import { Component, forwardRef, inject, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Modes } from '@models/modes.enum';

@Component({
	selector: 'app-test-custom-defects',
	templateUrl: './custom-defects.component.html',
	imports: [FormsModule, ReactiveFormsModule],
	styleUrls: ['./custom-defects.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CustomDefectsComponent),
			multi: true,
		},
	],
})
export class CustomDefectsComponent {
	testService = inject(TestService);

	mode = input.required<Modes>();

	form = this.testService.form;
}
