import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { Roles } from '@models/roles.enum';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';
import { RoleRequiredDirective } from '../../directives/app-role-required/app-role-required.directive';
import { VehicleTechnicalRecordComponent } from './components/vehicle-technical-record/vehicle-technical-record.component';

@Component({
	selector: 'app-tech-record',
	templateUrl: './tech-record.component.html',
	imports: [RoleRequiredDirective, VehicleTechnicalRecordComponent, AsyncPipe],
})
export class TechRecordComponent implements OnInit {
	systemNumber?: string;
	createdTimestamp?: string;

	constructor(
		private techRecordService: TechnicalRecordService,
		private router: Router,
		public errorService: GlobalErrorService,
		private route: ActivatedRoute
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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
