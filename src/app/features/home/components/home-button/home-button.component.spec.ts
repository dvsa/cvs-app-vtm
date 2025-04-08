import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeButtonComponent } from './home-button.component';

describe('HomeButtonComponent', () => {
	let component: HomeButtonComponent;
	let fixture: ComponentFixture<HomeButtonComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HomeButtonComponent],
			providers: [provideRouter([])],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
