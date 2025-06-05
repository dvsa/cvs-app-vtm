import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { NoSpaceDirective } from '@directives/app-no-space/app-no-space.directive';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@directives/app-trim-whitespace/app-trim-whitespace.directive';
import { NoEmojisDirective } from '@directives/no-emojis/no-emojis.directive';
import { Roles } from '@models/roles.enum';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { Store } from '@ngrx/store';
import { clearAllSectionStates, clearScrollPosition } from '@store/technical-records';
import { Observable, map } from 'rxjs';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	imports: [
		RoleRequiredDirective,
		NgClass,
		NgTemplateOutlet,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		ButtonComponent,
		AsyncPipe,
		NoEmojisDirective,
	],
})
export class SearchComponent {
	globalErrorService = inject(GlobalErrorService);
	router = inject(Router);
	store = inject(Store);

	missingTermErrorMessage =
		'You must provide a vehicle registration mark, trailer ID or vehicle identification number.';
	missingTypeErrorMessage = 'You must select a valid search criteria';

	navigateSearch(term: string, type: string): void {
		this.globalErrorService.clearErrors();
		this.store.dispatch(clearAllSectionStates());
		this.store.dispatch(clearScrollPosition());
		term = term.trim();

		if (!term) {
			this.globalErrorService.addError({ error: this.missingTermErrorMessage, anchorLink: 'search-term' });
		} else if (!Object.values(SEARCH_TYPES).includes(type as SEARCH_TYPES)) {
			this.globalErrorService.addError({ error: this.missingTypeErrorMessage, anchorLink: 'search-type' });
		} else {
			void this.router.navigate(['/search/results'], { queryParams: { [type]: term } });
		}
	}

	getInlineErrorMessage(name: string): Observable<boolean> {
		return this.globalErrorService.errors$.pipe(map((errors) => errors.some((error) => error.anchorLink === name)));
	}

	getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
		return errors.find((error) => error.anchorLink === name);
	}

	public get roles() {
		return Roles;
	}
}
