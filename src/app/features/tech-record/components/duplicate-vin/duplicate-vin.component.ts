import { UpperCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { Store } from '@ngrx/store';
import { editingTechRecord } from '@store/technical-records';

@Component({
	selector: 'app-duplicate-vin',
	templateUrl: './duplicate-vin.component.html',
	imports: [ButtonComponent, ButtonGroupComponent, UpperCasePipe, ReactiveFormsModule],
})
export class DuplicateVinComponent implements OnInit {
	store = inject(Store);
	router = inject(Router);
	route = inject(ActivatedRoute);

	techRecord = this.store.selectSignal(editingTechRecord);

	ngOnInit() {
		if (!this.techRecord()) {
			this.onNavigateBack();
		}
	}

	onSubmit() {
		void this.router.navigate(['../create/new-record-details']);
	}

	onNavigateBack() {
		void this.router.navigate(['..'], { relativeTo: this.route });
	}
}
