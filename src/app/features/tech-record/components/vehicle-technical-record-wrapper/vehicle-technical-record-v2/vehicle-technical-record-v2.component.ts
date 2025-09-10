import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditTechRecordButtonComponent } from '../../edit-tech-record-button/edit-tech-record-button.component';

@Component({
	selector: 'app-vehicle-technical-record-v2',
	templateUrl: './vehicle-technical-record-v2.component.html',
	styleUrls: ['./vehicle-technical-record-v2.component.scss'],
	imports: [RoleRequiredDirective, EditTechRecordButtonComponent],
})
export class VehicleTechnicalRecordV2Component {
	route = inject(ActivatedRoute);
	router = inject(Router);

	techRecord = input<V3TechRecordModel>();

	roles = Roles;
	isEditing = this.route.snapshot.data['isEditing'] ?? false;
	isDirty = false;

	handleSubmit(): void {
		this.router.navigate(['change-summary'], { relativeTo: this.route });
	}

	navigateBack(): void {
		this.router.navigate(['../'], { relativeTo: this.route });
	}
}
