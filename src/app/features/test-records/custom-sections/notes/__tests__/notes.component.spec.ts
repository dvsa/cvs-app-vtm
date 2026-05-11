import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { NotesComponent } from '../notes.component';

describe('NotesComponent', () => {
	let fixture: ComponentFixture<NotesComponent>;
	let component: NotesComponent;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [NotesComponent],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(NotesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
