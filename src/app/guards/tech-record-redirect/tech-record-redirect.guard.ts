import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RootRoutes } from '@models/routes.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { HttpService } from '@services/http/http.service';
import { catchError, map, of } from 'rxjs';

export const techRecordRedirectGuard: CanActivateFn = (route) => {
	const router = inject(Router);
	const httpService = inject(HttpService);
	const systemNumber = route.paramMap.get('systemNumber');

	if (!systemNumber) {
		return router.createUrlTree([RootRoutes.NOT_FOUND]);
	}

	return httpService.searchTechRecordBySystemNumber(systemNumber).pipe(
		map((results) => {
			const matchingRecords = results.filter((record) => record.systemNumber === systemNumber);
			const status = [StatusCodes.CURRENT, StatusCodes.PROVISIONAL, StatusCodes.ARCHIVED].find((candidate) =>
				matchingRecords.some((record) => record.techRecord_statusCode === candidate)
			);
			if (!status) {
				return router.createUrlTree([RootRoutes.NOT_FOUND]);
			}

			const records = matchingRecords.filter((record) => record.techRecord_statusCode === status);
			if (records.some((record) => !Number.isFinite(Date.parse(record.createdTimestamp)))) {
				return router.createUrlTree([RootRoutes.ERROR]);
			}

			const latest = records.reduce((a, b) =>
				Date.parse(a.createdTimestamp) >= Date.parse(b.createdTimestamp) ? a : b
			);
			return router.createUrlTree(['/tech-records', systemNumber, latest.createdTimestamp]);
		}),
		catchError((error: unknown) =>
			of(
				router.createUrlTree([
					error instanceof HttpErrorResponse && error.status === 404 ? RootRoutes.NOT_FOUND : RootRoutes.ERROR,
				])
			)
		)
	);
};
