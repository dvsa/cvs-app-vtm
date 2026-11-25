import { ButtonComponent } from '@/src/app/components/button/button.component';
import { TagComponent } from '@/src/app/components/tag/tag.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { TruncatePipe } from '@/src/app/pipes/truncate/truncate.pipe';
import { ResultOfTestService } from '@/src/app/services/result-of-test/result-of-test.service';
import { TestRecordsService } from '@/src/app/services/test-records/test-records.service';
import { TestService } from '@/src/app/services/test/test.service';
import { testResultInEdit, toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, skip, startWith } from 'rxjs';

@Component({
	selector: 'app-test-required-standards',
	templateUrl: './required-standards.component.html',
	imports: [ButtonComponent, RouterLink, TagComponent, TruncatePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequiredStandardsComponent implements OnInit {
	store = inject(Store);
	router = inject(Router);
	route = inject(ActivatedRoute);
	viewportScroller = inject(ViewportScroller);
	globalErrorService = inject(GlobalErrorService);
	resultOfTestService = inject(ResultOfTestService);
	testRecordsService = inject(TestRecordsService);
	testService = inject(TestService);
	destroyRef = inject(DestroyRef);

	mode = input.required<Modes>();

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	editingTestResult = this.store.selectSignal(testResultInEdit);
	requiredStandards = computed(() => this.testResult()?.testTypes[0].requiredStandards ?? []);

	readonly Modes = Modes;

	ngOnInit(): void {
		if (!this.isEditing()) return;

		this.syncResultWithRequiredStandards();
		this.handleEuVehicleCategoryChange();
	}

	isEditing(): boolean {
		return this.mode() === Modes.EDIT || this.mode() === Modes.AMEND;
	}

	handleEuVehicleCategoryChange(): void {
		// Required standards are specific to the EU vehicle category, so changing it clears any that were added
		const euVehicleCategory = this.form.controls.euVehicleCategory;
		euVehicleCategory.valueChanges
			.pipe(startWith(euVehicleCategory.value), distinctUntilChanged(), skip(1), takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				const requiredStandards = this.form.controls.testTypes.at(0).controls.requiredStandards;
				if (!requiredStandards.value?.length) return;

				requiredStandards.setValue([], { emitEvent: false });
				this.syncResultWithRequiredStandards();
			});
	}

	/** The result of the test is derived from its required standards, so recalculate it from the latest form value. */
	syncResultWithRequiredStandards(): void {
		this.testRecordsService.updateEditingTestResult(this.form.getRawValue() as TestResultSchema);
		this.resultOfTestService.updateResultOfTestRequiredStandards();

		const testResult = this.editingTestResult()?.testTypes[0].testResult ?? null;
		this.form.controls.testTypes.at(0).controls.testResult.setValue(testResult, { emitEvent: false });
	}

	onAddRequiredStandard(): void {
		this.globalErrorService.clearErrors();

		// Required standards are looked up by EU vehicle category, so one must be selected first
		const euVehicleCategory = this.form.controls.euVehicleCategory;
		if (!euVehicleCategory.value) {
			euVehicleCategory.markAsTouched();
			euVehicleCategory.updateValueAndValidity();
			this.globalErrorService.setErrors([
				{ error: 'EU Vehicle Category is required', anchorLink: 'euVehicleCategory' },
			]);
			this.viewportScroller.scrollToPosition([0, 0]);
			return;
		}

		// Flush any pending (debounced) form changes, so the required standard pages read the latest test result
		this.testRecordsService.updateEditingTestResult(this.form.getRawValue() as TestResultSchema);
		void this.router.navigate(['selectRequiredStandard'], { queryParamsHandling: 'preserve', relativeTo: this.route });
	}
}
