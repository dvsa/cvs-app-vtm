import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { RootRoutes } from '@/src/app/models/routes.enum';
import { clearBatch } from '@/src/app/store/technical-records/batch-create.actions';
import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-cancel-batch',
	templateUrl: './cancel-batch.component.html',
	styleUrls: ['./cancel-batch.component.scss'],
	imports: [ButtonComponent, ButtonGroupComponent],
})
export class CancelBatchComponent {
	readonly store = inject(Store);
	readonly router = inject(Router);
	readonly location = inject(Location);

	handleBack(): void {
		this.location.back();
	}

	handleCancelBatch(): void {
		this.store.dispatch(clearBatch());
		this.router.navigate([RootRoutes.ROOT]);
	}
}
