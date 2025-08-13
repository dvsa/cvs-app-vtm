import { AccordionControlComponent } from '@/src/app/components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@/src/app/components/accordion/accordion.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { TechRecordCreateRoutes } from '@/src/app/models/routes.enum';
import { selectSectionState } from '@/src/app/store/technical-records';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-hydrate-new-vehicle-record-v2',
	templateUrl: './hydrate-new-vehicle-record-v2.component.html',
	styleUrls: ['./hydrate-new-vehicle-record-v2.component.scss'],
	imports: [AccordionControlComponent, AccordionComponent, NgTemplateOutlet, ButtonComponent],
})
export class HydrateNewVehicleRecordV2Component {
	store = inject(Store);
	route = inject(ActivatedRoute);
	router = inject(Router);

	sectionStates$ = this.store.selectSignal(selectSectionState);

	onChange(): void {
		this.router.navigate(['create']);
	}

	onCancel(): void {
		this.router.navigate([TechRecordCreateRoutes.NEW_RECORD_DETAILS_CANCEL], { relativeTo: this.route });
	}

	onCreateNewRecord(): void {}
}
