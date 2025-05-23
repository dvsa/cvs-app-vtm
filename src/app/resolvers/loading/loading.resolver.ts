import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LoadingService } from '@services/loading/loading.service';
import { map } from 'rxjs';

export const loadingResolver: ResolveFn<boolean> = () => {
	const loadingService = inject(LoadingService);
	return loadingService.showSpinner$.pipe(map((showSpinner) => !showSpinner));
};
