import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { NoEmojisDirective } from '@/src/app/directives/no-emojis/no-emojis.directive';
import { GovukFormGroupCheckboxComponent } from '@/src/app/forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { clearAllSectionStates, clearScrollPosition } from '@/src/app/store/technical-records';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-search-form',
	templateUrl: './search-form.component.html',
	styleUrls: ['./search-form.component.scss'],
	imports: [
		ButtonComponent,
		GovukFormGroupInputComponent,
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		GovukFormGroupCheckboxComponent,
		NoEmojisDirective,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
	],
})
export class SearchFormComponent implements OnInit, OnDestroy {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
	validators = inject(CommonValidatorsService);
	globalErrorService = inject(GlobalErrorService);

	searchResults = input<number>();

	form = this.fb.group({
		searchTerm: this.fb.control('', [
			this.validators.required(() => ({
				error: 'You must provide a vehicle registration mark, trailer ID or vehicle identification number.',
				anchorLink: 'search-term',
			})),
		]),
		searchCriteria: this.fb.control('all', [
			this.validators.required(() => ({
				error: 'You must select a valid search criteria',
				anchorLink: 'searchCriteria',
			})),
		]),
		includeArchived: this.fb.control(false),
	});

	showFilterPanel = false;
	destroy = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.activatedRoute.queryParamMap.pipe(takeUntil(this.destroy)).subscribe((params) => {
			const searchTerm = params.get('searchTerm');
			const searchCriteria = params.get('searchCriteria');
			const includeArchived = params.get('includeArchived') === 'true';

			this.form.patchValue({
				searchTerm: searchTerm ?? '',
				searchCriteria: searchCriteria ?? 'all',
				includeArchived: includeArchived ?? false,
			});
		});
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	search(): void {
		this.globalErrorService.clearErrors();
		this.store.dispatch(clearAllSectionStates());
		this.store.dispatch(clearScrollPosition());
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			const errors = this.globalErrorService.extractGlobalErrors(this.form);
			this.globalErrorService.setErrors(errors);
		}

		if (this.form.valid) {
			const queryParams = this.form.getRawValue();
			this.router.navigate(['/search/results'], { queryParams, queryParamsHandling: 'merge' });
		}
	}
}
