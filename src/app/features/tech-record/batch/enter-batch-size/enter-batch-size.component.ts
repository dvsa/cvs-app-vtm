import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { setBatchDetails } from '@/src/app/store/technical-records/batch-create.actions';
import {
	selectBatchDetails,
	selectBatchVehicleTypeDescriptor,
} from '@/src/app/store/technical-records/batch-create.selectors';
import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-enter-batch-size',
	templateUrl: './enter-batch-size.component.html',
	styleUrls: ['./enter-batch-size.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, ButtonComponent, ButtonGroupComponent, GovukFormGroupInputComponent],
})
export class EnterBatchSizeComponent implements OnInit {
	readonly fb = inject(FormBuilder);
	readonly router = inject(Router);
	readonly store = inject(Store);
	readonly title = inject(Title);
	readonly errorService = inject(GlobalErrorService);
	readonly validators = inject(CommonValidatorsService);

	readonly savedBatchDetails = this.store.selectSignal(selectBatchDetails);
	readonly vehicleTypeDescriptor = this.store.selectSignal(selectBatchVehicleTypeDescriptor);
	readonly pageTitle = computed(() => this.computePageTitle());

	readonly FormNodeWidth = FormNodeWidth;

	readonly form = this.fb.group({
		batchSize: this.fb.control<number | null>(null, [
			this.validators.required(() => ({ error: 'Enter a number from 1 to 41', anchorLink: 'batchSize' })),
			this.validators.range(1, 41, () => ({ error: 'Enter a number from 1 to 41', anchorLink: 'batchSize' })),
		]),
	});

	constructor() {
		effect(() => this.title.setTitle(this.pageTitle()));
	}

	ngOnInit(): void {
		this.handlePopulateForm();
	}

	computePageTitle(): string {
		return `Enter number of ${this.vehicleTypeDescriptor()}s in this batch`;
	}

	handlePopulateForm(): void {
		const savedBatchDetails = this.savedBatchDetails();
		this.form.patchValue(savedBatchDetails);

		// Once a batch size is entered it cannot be changed by going back to this page
		if (savedBatchDetails.batchSize) {
			this.form.controls.batchSize.disable({ emitEvent: false });
		}
	}

	handleContinue(): void {
		this.form.markAllAsTouched();

		const errors = this.errorService.extractGlobalErrors(this.form);
		if (errors.length > 0) {
			this.errorService.setErrors(errors);
		}

		if (errors.length === 0) {
			const batchSize = this.form.controls.batchSize.getRawValue();
			this.store.dispatch(setBatchDetails({ batchSize: batchSize as number }));
			this.router.navigate([RootRoutes.BATCH, BatchRoutes.ENTER_BATCH_IDENTIFIERS]);
		}
	}

	handleCancel(): void {
		this.router.navigate([RootRoutes.BATCH, BatchRoutes.CANCEL_BATCH]);
	}
}
