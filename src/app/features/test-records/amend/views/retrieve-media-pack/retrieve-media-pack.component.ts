import { BannerComponent } from '@/src/app/components/banner/banner.component';
import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/radio/radio.component';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-retrieve-media-pack',
	templateUrl: './retrieve-media-pack.component.html',
	imports: [
		BannerComponent,
		ButtonComponent,
		ButtonGroupComponent,
		GovukFormGroupRadioComponent,
		RadioComponent,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class RetrieveMediaPackComponent {
	sent = false;

	fb = inject(FormBuilder);

	form = this.fb.group({
		confirm: [false],
	});

	onContinue() {
		this.sent = true;
	}
}
