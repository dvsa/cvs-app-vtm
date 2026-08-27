import { RootRoutes } from '@/src/app/models/routes.enum';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { CancelBatchComponent } from '../cancel-batch.component';

describe('CancelBatchComponent', () => {
	let router: Router;
	let location: Location;
	let fixture: ComponentFixture<CancelBatchComponent>;
	let component: CancelBatchComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CancelBatchComponent],
			providers: [
				{ provide: Location, useValue: { back: jest.fn() } },
				provideRouter([
					{
						path: RootRoutes.ROOT,
						component: jest.fn(),
					},
				]),
			],
		}).compileComponents();

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
		it('should navigate the user to the home page', () => {
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.handleCancelBatch();
			expect(navigateSpy).toHaveBeenCalledWith([RootRoutes.ROOT]);
		});
	});
});
