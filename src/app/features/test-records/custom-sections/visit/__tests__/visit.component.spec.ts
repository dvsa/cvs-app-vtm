import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { VisitComponent } from '../visit.component';

describe('VisitComponent', () => {
	let fixture: ComponentFixture<VisitComponent>;
	let component: VisitComponent;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [VisitComponent],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(VisitComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
