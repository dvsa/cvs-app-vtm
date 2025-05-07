import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { techRecord } from '@store/technical-records';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-documents-section-view',
	templateUrl: './documents-section-view.component.html',
	styleUrls: ['./documents-section-view.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, DefaultNullOrEmpty],
})
export class DocumentsSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;
	store = inject(Store);
	techRecord = this.store.selectSignal(techRecord);
	destroy$ = new ReplaySubject<boolean>(1);
}
