import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { RootRoutes } from '@/src/app/models/routes.enum';
import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-cancel-batch',
	templateUrl: './cancel-batch.component.html',
	styleUrls: ['./cancel-batch.component.scss'],
	imports: [ButtonComponent, ButtonGroupComponent],
})
export class CancelBatchComponent {
	readonly router = inject(Router);
	readonly location = inject(Location);

	handleBack(): void {
		this.location.back();
	}

	handleCancelBatch(): void {
		this.router.navigate([RootRoutes.ROOT]);
	}
}
