import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { DocumentType } from '@/src/app/models/document-type.enum';
import { DocumentsService } from '@/src/app/services/documents/documents.service';
import { HttpService } from '@/src/app/services/http/http.service';
import { setSpinnerState } from '@/src/app/store/spinner/spinner.actions';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';
import { RetrieveDocumentDirective } from '../retrieve-document.directive';

@Component({
	imports: [RetrieveDocumentDirective],
	template: `<a href="#document" appRetrieveDocument [params]="params" [fileName]="fileName()"
		[loading]="loading()" [certNotNeeded]="certNotNeeded()" [fileType]="fileType()" [documentType]="documentType()">Download</a>`,
})
class TestComponent {
	params = new Map([['testResultId', 'result-1']]);
	fileName = signal('certificate');
	loading = signal(true);
	certNotNeeded = signal(false);
	fileType = signal('pdf');
	documentType = signal(DocumentType.CERTIFICATE);
}

describe('RetrieveDocumentDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let link: HTMLAnchorElement;
	let store: MockStore;
	let responses: Subject<HttpEvent<string>>;
	let httpService: { getDocument: ReturnType<typeof vi.fn> };
	let documentsService: { openDocumentFromResponse: ReturnType<typeof vi.fn> };
	let globalErrorService: { setErrors: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		responses = new Subject<HttpEvent<string>>();
		httpService = { getDocument: vi.fn().mockReturnValue(responses) };
		documentsService = { openDocumentFromResponse: vi.fn() };
		globalErrorService = { setErrors: vi.fn() };
		TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [
				provideMockStore(),
				{ provide: HttpService, useValue: httpService },
				{ provide: DocumentsService, useValue: documentsService },
				{ provide: GlobalErrorService, useValue: globalErrorService },
			],
		});
		store = TestBed.inject(MockStore);
		vi.spyOn(store, 'dispatch');
		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		link = fixture.nativeElement.querySelector('a');
	});

	function clickLink() {
		const event = new MouseEvent('click', { bubbles: true, cancelable: true });
		const stopPropagation = vi.spyOn(event, 'stopPropagation');
		link.dispatchEvent(event);
		return { event, stopPropagation };
	}

	it('requests the document, prevents navigation, and shows the spinner while downloading', () => {
		const { event, stopPropagation } = clickLink();

		expect(event.defaultPrevented).toBe(true);
		expect(stopPropagation).toHaveBeenCalledOnce();
		expect(httpService.getDocument).toHaveBeenCalledWith(fixture.componentInstance.params);
		expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(setSpinnerState({ showSpinner: true }));
		expect(documentsService.openDocumentFromResponse).not.toHaveBeenCalled();
		expect(link.classList.contains('govuk-link-visited')).toBe(false);
	});

	it('leaves the link alone when no certificate is needed', () => {
		fixture.componentInstance.certNotNeeded.set(true);
		fixture.detectChanges();
		const { event, stopPropagation } = clickLink();

		expect(event.defaultPrevented).toBe(false);
		expect(stopPropagation).not.toHaveBeenCalled();
		expect(httpService.getDocument).not.toHaveBeenCalled();
		expect(store.dispatch).not.toHaveBeenCalled();
	});

	it('does not show a loading spinner when loading is disabled', () => {
		fixture.componentInstance.loading.set(false);
		fixture.detectChanges();
		clickLink();
		expect(httpService.getDocument).toHaveBeenCalledOnce();
		expect(store.dispatch).not.toHaveBeenCalled();
	});

	it('ignores sent and progress events before opening the completed document', () => {
		clickLink();
		responses.next({ type: HttpEventType.Sent });
		responses.next({ type: HttpEventType.DownloadProgress, loaded: 20, total: 100 });
		expect(documentsService.openDocumentFromResponse).not.toHaveBeenCalled();
		expect(link.classList.contains('govuk-link-visited')).toBe(false);

		responses.next(new HttpResponse({ body: 'encoded-pdf' }));

		expect(documentsService.openDocumentFromResponse).toHaveBeenCalledExactlyOnceWith(
			'certificate',
			'encoded-pdf',
			'pdf'
		);
		expect(link.classList.contains('govuk-link-visited')).toBe(true);
		expect(store.dispatch).toHaveBeenLastCalledWith(setSpinnerState({ showSpinner: false }));
	});

	it('uses the configured filename and file type and stops listening after the first response', () => {
		fixture.componentInstance.fileName.set('approval-media.zip');
		fixture.componentInstance.fileType.set('zip');
		fixture.detectChanges();
		clickLink();
		responses.next(new HttpResponse({ body: 'signed-url' }));
		responses.next(new HttpResponse({ body: 'duplicate-url' }));

		expect(documentsService.openDocumentFromResponse).toHaveBeenCalledExactlyOnceWith(
			'approval-media.zip',
			'signed-url',
			'zip'
		);
	});

	it('does not add the visited class again when a document is downloaded twice', () => {
		link.classList.add('govuk-link-visited');
		const addClass = vi.spyOn(link.classList, 'add');
		clickLink();
		responses.next(new HttpResponse({ body: 'encoded-pdf' }));

		expect(documentsService.openDocumentFromResponse).toHaveBeenCalledOnce();
		expect(addClass).not.toHaveBeenCalled();
	});

	it.each([DocumentType.CERTIFICATE, DocumentType.ADR_CERTIFICATE, DocumentType.PLATE, DocumentType.LETTER])(
		'shows a document-specific error when a %s cannot be found',
		(documentType) => {
			fixture.componentInstance.documentType.set(documentType);
			fixture.detectChanges();
			clickLink();
			responses.error(new HttpErrorResponse({ status: HttpStatusCode.NotFound }));

			expect(globalErrorService.setErrors).toHaveBeenCalledExactlyOnceWith([
				{
					error: `${documentType} could not be found. <br>Try again later or contact the service desk if this issue keeps happening.`,
					anchorLink: '',
				},
			]);
			expect(documentsService.openDocumentFromResponse).not.toHaveBeenCalled();
			expect(link.classList.contains('govuk-link-visited')).toBe(false);
		}
	);
});
