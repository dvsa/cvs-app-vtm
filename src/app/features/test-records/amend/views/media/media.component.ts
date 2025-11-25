import { BannerComponent } from '@/src/app/components/banner/banner.component';
import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/radio/radio.component';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-media',
	templateUrl: './media.component.html',
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
export class MediaComponent {}
