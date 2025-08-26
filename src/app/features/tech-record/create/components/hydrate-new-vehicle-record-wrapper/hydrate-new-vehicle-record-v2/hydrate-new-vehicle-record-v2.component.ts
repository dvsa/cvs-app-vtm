import { AccordionControlComponent } from '@/src/app/components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@/src/app/components/accordion/accordion.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { NumberPlateComponent } from '@/src/app/components/number-plate/number-plate.component';
import { TagComponent, TagType } from '@/src/app/components/tag/tag.component';
import { RootRoutes, TechRecordCreateRoutes } from '@/src/app/models/routes.enum';
import { StatusCodes, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormatVehicleTypePipe } from '@/src/app/pipes/format-vehicle-type/format-vehicle-type.pipe';
import { selectSectionState, selectTechRecord } from '@/src/app/store/technical-records';
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-hydrate-new-vehicle-record-v2',
	templateUrl: './hydrate-new-vehicle-record-v2.component.html',
	styleUrls: ['./hydrate-new-vehicle-record-v2.component.scss'],
	imports: [
		AccordionControlComponent,
		AccordionComponent,
		NgTemplateOutlet,
		ButtonComponent,
		NumberPlateComponent,
		DefaultNullOrEmpty,
		TagComponent,
		FormatVehicleTypePipe,
	],
})
export class HydrateNewVehicleRecordV2Component implements OnInit {
	store = inject(Store);
	route = inject(ActivatedRoute);
	router = inject(Router);

	techRecord$ = this.store.selectSignal(selectTechRecord);
	sectionStates$ = this.store.selectSignal(selectSectionState);

	readonly TagType = TagType;
	readonly VehicleTypes = VehicleTypes;
	readonly StatusCodes = StatusCodes;

	ngOnInit(): void {
		this.handleEmptyEditingTechRecord();
	}

	onChange(): void {
		this.router.navigate([RootRoutes.CREATE_TECHNICAL_RECORD]);
	}

	onCancel(): void {
		this.router.navigate([TechRecordCreateRoutes.NEW_RECORD_DETAILS_CANCEL], { relativeTo: this.route });
	}

	onCreateNewRecord(): void {}

	private handleEmptyEditingTechRecord(): void {
		if (!this.techRecord$()) {
			this.router.navigate([RootRoutes.CREATE_TECHNICAL_RECORD]);
		}
	}
}
