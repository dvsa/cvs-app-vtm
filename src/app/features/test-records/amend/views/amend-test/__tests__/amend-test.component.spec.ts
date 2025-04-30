import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AmendTestComponent } from '../amend-test.component';

describe('AmendTestComponent', () => {
	let component: AmendTestComponent;
	let fixture: ComponentFixture<AmendTestComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AmendTestComponent],
			providers: [provideRouter([])],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AmendTestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
