import { RootRoutes } from '@/src/app/models/routes.enum';
import { initialAppState } from '@/src/app/store';
import { clearBatch } from '@/src/app/store/technical-records/batch-create.actions';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CancelBatchComponent } from '../cancel-batch.component';

describe('CancelBatchComponent', () => {
	let store: MockStore;
	let router: Router;
	let location: Location;
	let fixture: ComponentFixture<CancelBatchComponent>;
	let component: CancelBatchComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CancelBatchComponent],
			providers: [
				{ provide: Location, useValue: { back: jest.fn() } },
				provideMockStore({ initialState: initialAppState }),
				provideRouter([
					{
						path: RootRoutes.ROOT,
						component: jest.fn(),
					},
				]),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		router = TestBed.inject(Router);
		location = TestBed.inject(Location);
		fixture = TestBed.createComponent(CancelBatchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('handleBack', () => {
		it('should call return the user back to their previous route', () => {
			const backSpy = jest.spyOn(location, 'back');
			component.handleBack();
			expect(backSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('handleCancelBatch', () => {
		it('should clear the batch and navigate the user to the home page', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.handleCancelBatch();
			expect(navigateSpy).toHaveBeenCalledWith([RootRoutes.ROOT]);
			expect(dispatchSpy).toHaveBeenCalledWith(clearBatch());
		});
	});
});
