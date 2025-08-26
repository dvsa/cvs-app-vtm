import { UpperCasePipe } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';
import { editingTechRecord } from '@store/technical-records';

@Component({
	selector: 'app-duplicate-vin',
	templateUrl: './duplicate-vin.component.html',
	imports: [ButtonComponent, ButtonGroupComponent, UpperCasePipe, ReactiveFormsModule],
})
export class DuplicateVinComponent {
	store = inject(Store);
	router = inject(Router);
	route = inject(ActivatedRoute);

	techRecord = this.store.selectSignal(editingTechRecord) as Signal<TechRecordType<'put'>>;

	onSubmit() {
		void this.router.navigate(['../create/new-record-details']);
	}

	onNavigateBack() {
		void this.router.navigate(['..'], { relativeTo: this.route });
	}
}
