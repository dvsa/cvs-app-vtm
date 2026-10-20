import { initialAppState } from '@/src/app/store';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { TechnicalRecordChangesService } from '../technical-record-change.service';

describe('TechnicalRecordChangesService change cache', () => {
	let service: TechnicalRecordChangesService;
	let store: MockStore;

	const setRecords = (current: unknown, amended: unknown) => {
		store.overrideSelector(techRecord, current as never);
		store.overrideSelector(editingTechRecord, amended as never);
		store.refreshState();
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState }), TechnicalRecordChangesService],
		});
		store = TestBed.inject(MockStore);
		service = TestBed.inject(TechnicalRecordChangesService);
	});

	it('should report a change as soon as the amended record changes, without waiting for effects to flush', () => {
		setRecords({ vin: 'A' }, { vin: 'A' });
		TestBed.tick();
		expect(service.hasChanged('vin')).toBe(false);

		// the records change mid change-detection; effects have not run yet
		setRecords({ vin: 'A' }, { vin: 'B' });

		expect(service.hasChanged('vin')).toBe(true);
	});

	it('should not serve cached answers once the amended record is cleared', () => {
		setRecords({ vin: 'A' }, { vin: 'A' });
		TestBed.tick();
		expect(service.hasChanged('vin')).toBe(false);

		// leaving edit mode clears the editing record; with no pair to compare, everything counts as changed
		setRecords({ vin: 'A' }, undefined);
		TestBed.tick();

		expect(service.hasChanged('vin')).toBe(true);
	});
});
