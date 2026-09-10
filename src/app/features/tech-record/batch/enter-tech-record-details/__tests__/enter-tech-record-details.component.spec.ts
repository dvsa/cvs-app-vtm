import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { EnterTechRecordDetailsComponent } from '../enter-tech-record-details.component';

describe('EnterTechRecordDetailsComponent', () => {
	let fixture: ComponentFixture<EnterTechRecordDetailsComponent>;
	let component: EnterTechRecordDetailsComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EnterTechRecordDetailsComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		fixture = TestBed.createComponent(EnterTechRecordDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
