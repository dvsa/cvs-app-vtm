import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Configuration, DocumentRetrievalService } from '@api/document-retrieval';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DocumentsService } from '@services/documents/documents.service';
import { State, initialAppState } from '@store/index';
import { RetrieveDocumentDirective } from './retrieve-document.directive';

describe('RetrieveDocumentDirective', () => {
	let store: MockStore<State>;
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});
	});
	it('should create an instance', () => {
		const directive = new RetrieveDocumentDirective(
			new DocumentRetrievalService({} as HttpClient, '', new Configuration()),
			new DocumentsService(),
			store
		);
		expect(directive).toBeTruthy();
	});
});
