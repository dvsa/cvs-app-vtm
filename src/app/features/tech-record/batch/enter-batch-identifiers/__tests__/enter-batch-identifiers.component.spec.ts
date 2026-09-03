import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { EnterBatchIdentifiers } from '../enter-batch-identifiers.component';

describe('EnterBatchIdentifiers', () => {
	let fixture: ComponentFixture<EnterBatchIdentifiers>;
	let component: EnterBatchIdentifiers;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EnterBatchIdentifiers],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		fixture = TestBed.createComponent(EnterBatchIdentifiers);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
