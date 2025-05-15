import { initialAppState } from '@/src/app/store';
import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { AdrSectionComponent } from '../adr-section.component';

describe('AdrSectionComponent', () => {
	let store: MockStore;
	let component: AdrSectionComponent;
	let fixture: ComponentFixture<AdrSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AdrSectionComponent],
			providers: [
				ControlContainer,
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AdrSectionComponent);
		fixture.componentRef.setInput('techRecord', createMockHgv(123));
		component = fixture.componentInstance;
		fixture.detectChanges();

		store = TestBed.inject(MockStore);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
