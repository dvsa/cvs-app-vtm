import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutletComponent } from '../router-outlet.component';

describe('RouterOutletComponent', () => {
	let component: RouterOutletComponent;
	let fixture: ComponentFixture<RouterOutletComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [RouterOutletComponent],
			imports: [RouterTestingModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RouterOutletComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
