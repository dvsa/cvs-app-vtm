import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { updateEditingTechRecordCancel } from '@store/technical-records';
import { TechRecordComponent } from 'src/app/features/tech-record/tech-record.component';

@Injectable({
	providedIn: 'root',
})
export class CancelEditTechGuard implements CanDeactivate<TechRecordComponent>, CanActivate {
	constructor(private store: Store<State>) {}

	canActivate(): boolean {
		this.store.dispatch(updateEditingTechRecordCancel());
		return true;
	}

	canDeactivate(): boolean {
		this.store.dispatch(updateEditingTechRecordCancel());
		return true;
	}
}
