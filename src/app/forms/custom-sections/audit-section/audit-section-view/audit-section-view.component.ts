import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-audit-section-view',
	templateUrl: './audit-section-view.component.html',
	styleUrls: ['./audit-section-view.component.scss'],
	imports: [DefaultNullOrEmpty, DatePipe],
})
export class AuditSectionViewComponent {
	store = inject(Store);
	techRecord = this.store.selectSignal(techRecord);
}
