import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestRouterOutletComponent } from '../test-router-outlet.component';

describe('TestRouterOutletComponent', () => {
	let component: TestRouterOutletComponent;
	let fixture: ComponentFixture<TestRouterOutletComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestRouterOutletComponent],
			providers: [provideRouter([])],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestRouterOutletComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
