import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { Roles } from '@models/roles.enum';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';
import { VehicleTechnicalRecordWrapperComponent } from './components/vehicle-technical-record-wrapper/vehicle-technical-record-wrapper.component';

@Component({
	selector: 'app-tech-record',
	templateUrl: './tech-record.component.html',
	imports: [RoleRequiredDirective, VehicleTechnicalRecordWrapperComponent, AsyncPipe],
})
export class TechRecordComponent implements OnInit {
	techRecordService = inject(TechnicalRecordService);
	router = inject(Router);
	errorService = inject(GlobalErrorService);
	route = inject(ActivatedRoute);

	systemNumber?: string;
	createdTimestamp?: string;

	constructor() {
		// Only prevent reuse when route path params change i.e. diff tech record
		// Allow reuse when only query parameters change (e.g., pagination)
		this.router.routeReuseStrategy.shouldReuseRoute = (future, curr) => {
			return future.routeConfig === curr.routeConfig && JSON.stringify(future.params) === JSON.stringify(curr.params);
		};
	}

	ngOnInit(): void {
		this.route.params.pipe(take(1)).subscribe((params) => {
			this.systemNumber = params['systemNumber'];
			this.createdTimestamp = params['createdTimestamp'];
		});
	}

	get techRecord$() {
		return this.techRecordService.techRecord$;
	}

	get roles() {
		return Roles;
	}

	getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
		return errors.find((error) => error.anchorLink === name);
	}
}
