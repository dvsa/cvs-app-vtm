import { BannerComponent } from '@/src/app/components/banner/banner.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Modes } from '@/src/app/models/modes.enum';
import { Roles } from '@/src/app/models/roles.enum';
import { V3TechRecordModel, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectQueryParam } from '@/src/app/store/router/router.selectors';
import { ChangeDetectionStrategy, Component, inject, input, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EditTechRecordButtonComponent } from '../../edit-tech-record-button/edit-tech-record-button.component';
import { TechRecordSummaryCardComponent } from '../../tech-record-summary-card/tech-record-summary-card.component';
import { TechRecordComponent } from '../../tech-record/tech-record.component';

@Component({
	selector: 'app-vehicle-technical-record-v2',
	templateUrl: './vehicle-technical-record-v2.component.html',
	styleUrls: ['./vehicle-technical-record-v2.component.scss'],
	imports: [
		RoleRequiredDirective,
		EditTechRecordButtonComponent,
		BannerComponent,
		TechRecordComponent,
		TechRecordSummaryCardComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleTechnicalRecordV2Component {
	readonly store = inject(Store);
	readonly route = inject(ActivatedRoute);
	readonly router = inject(Router);
	readonly technicalRecordService = inject(TechnicalRecordService);
	readonly globalErrorService = inject(GlobalErrorService);

	readonly techRecord = input<V3TechRecordModel>();
	readonly techRecordComponent = viewChild(TechRecordComponent);

	readonly from = this.store.selectSignal(selectQueryParam('from'));

	isEditing = this.route.snapshot.data['isEditing'] ?? false;
	isDirty = false;

	readonly Roles = Roles;
	readonly Modes = Modes;
	readonly VehicleTypes = VehicleTypes;

	handleSubmit(): void {
		const techRecordComponent = this.techRecordComponent();
		if (!techRecordComponent) return;

		const form = techRecordComponent.form;

		this.globalErrorService.markAllAsTouched(form);

		if (form.valid) {
			this.router.navigate(['change-summary'], { relativeTo: this.route });
		}

		if (form.invalid) {
			this.globalErrorService.setErrors(this.globalErrorService.extractGlobalErrors(form));
		}
	}

	navigateBack(): void {
		this.router.navigate(['../'], { relativeTo: this.route });
	}
}
