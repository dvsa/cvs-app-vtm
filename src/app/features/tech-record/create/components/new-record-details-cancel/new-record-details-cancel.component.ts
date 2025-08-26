import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-new-record-details-cancel',
	templateUrl: './new-record-details-cancel.component.html',
	styleUrls: ['./new-record-details-cancel.component.scss'],
	imports: [ButtonGroupComponent, ButtonComponent],
})
export class NewRecordDetailsCancel {
	route = inject(ActivatedRoute);
	router = inject(Router);
	location = inject(Location);
	globalErrorService = inject(GlobalErrorService);
	technicalRecordService = inject(TechnicalRecordService);

	cancelRecord() {
		this.globalErrorService.clearErrors();
		this.technicalRecordService.clearEditingTechRecord();
		this.router.navigate(['']);
	}

	back() {
		// use location.back() to avoid circular loop
		this.location.back();
	}
}
