import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { RootRoutes } from '@models/routes.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { HttpService } from '@services/http/http.service';
import { catchError, map, of } from 'rxjs';

export const techRecordSelectionResolver: ResolveFn<TechRecordSearchSchema[] | RedirectCommand> = (route) => {
	const router = inject(Router);
	const httpService = inject(HttpService);
	const systemNumber = route.paramMap.get('systemNumber');

	if (!systemNumber) {
		return new RedirectCommand(router.createUrlTree([RootRoutes.NOT_FOUND]));
	}

	return httpService.searchTechRecordBySystemNumber(systemNumber).pipe(
		map((results) => {
			const matchingRecords = results.filter((record) => record.systemNumber === systemNumber);
			const activeRecords = matchingRecords.filter(
				(record) =>
					record.techRecord_statusCode === StatusCodes.CURRENT ||
					record.techRecord_statusCode === StatusCodes.PROVISIONAL
			);
			const hasCurrent = activeRecords.some((record) => record.techRecord_statusCode === StatusCodes.CURRENT);
			const hasProvisional = activeRecords.some((record) => record.techRecord_statusCode === StatusCodes.PROVISIONAL);
			if (hasCurrent && hasProvisional) {
				if (activeRecords.some((record) => !Number.isFinite(Date.parse(record.createdTimestamp)))) {
					return new RedirectCommand(router.createUrlTree([RootRoutes.ERROR]));
				}
				return activeRecords;
			}
			const status = [StatusCodes.CURRENT, StatusCodes.PROVISIONAL, StatusCodes.ARCHIVED].find((candidate) =>
				matchingRecords.some((record) => record.techRecord_statusCode === candidate)
			);
			if (!status) {
				return new RedirectCommand(router.createUrlTree([RootRoutes.NOT_FOUND]));
			}

			const records = matchingRecords.filter((record) => record.techRecord_statusCode === status);
			if (records.some((record) => !Number.isFinite(Date.parse(record.createdTimestamp)))) {
				return new RedirectCommand(router.createUrlTree([RootRoutes.ERROR]));
			}

			const latest = records.reduce((a, b) =>
				Date.parse(a.createdTimestamp) >= Date.parse(b.createdTimestamp) ? a : b
			);
			return new RedirectCommand(router.createUrlTree(['/tech-records', systemNumber, latest.createdTimestamp]));
		}),
		catchError((error: unknown) =>
			of(
				new RedirectCommand(
					router.createUrlTree([
						error instanceof HttpErrorResponse && error.status === 404 ? RootRoutes.NOT_FOUND : RootRoutes.ERROR,
					])
				)
			)
		)
	);
};
