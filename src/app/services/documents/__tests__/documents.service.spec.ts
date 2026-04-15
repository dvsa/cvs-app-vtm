import { TestBed } from '@angular/core/testing';

import { DocumentsService } from '../documents.service';

global.URL.createObjectURL = vi.fn().mockReturnValue('objectURL');

const fileName = 'fileName';
const responseBody = 'Response body';

const domParser = new DOMParser();
const fakeAnchor = domParser
	.parseFromString('<a download="fileName.pdf" href="objectURL" target="_blank" />', 'text/html')
	.querySelector('a');

describe('DocumentsService', () => {
	let service: DocumentsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DocumentsService);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('openDocumentFromResponse', () => {
		it('should download a document sent back from a http response', () => {
			const convertToBlobSpy = vi.spyOn(service, 'convertToBlob');
			const createFileLinkSpy = vi.spyOn(service, 'createFileLink');
			const simulateClickSpy = vi.spyOn(service, 'simulateClick').mockImplementation((() => {}) as any);

			service.openDocumentFromResponse(fileName, responseBody);

			expect(convertToBlobSpy).toHaveBeenCalledWith(responseBody, 'pdf');
			expect(createFileLinkSpy).toHaveBeenCalledWith(fileName, expect.any(Blob), 'pdf');
			expect(simulateClickSpy).toHaveBeenCalledWith(fakeAnchor);
		});

		it('should download a document sent back with a signed url', () => {
			const convertToBlobSpy = vi.spyOn(service, 'convertToBlob');
			const createFileLinkSpy = vi.spyOn(service, 'createFileLink');
			const simulateClickSpy = vi.spyOn(service, 'simulateClick');

			const fakeAnchorZip = domParser
				.parseFromString('<a download="fileName.zip" href="Response body" />', 'text/html')
				.querySelector('a');

			service.openDocumentFromResponse(fileName, responseBody, 'zip');

			expect(convertToBlobSpy).not.toHaveBeenCalled();
			expect(createFileLinkSpy).not.toHaveBeenCalled();
			expect(simulateClickSpy).toHaveBeenCalledWith(fakeAnchorZip);
		});
	});

	describe('convertToBlob', () => {
		it('should throw an error if the data provided is not a string', () => {
			expect(service.convertToBlob.bind(0)).toThrow();
			expect(service.convertToBlob.bind(null)).toThrow();
			expect(service.convertToBlob.bind(undefined)).toThrow();
		});

		it('should return a blob of type application/pdf based on the string provided', () => {
			const result = service.convertToBlob('');
			expect(result).toBeInstanceOf(Blob);
		});
	});

	describe('createFileLink', () => {
		it('should create a downloadable anchor link for a pdf file, using the file name and blob provided', () => {
			expect(service.createFileLink(fileName, new Blob(), 'pdf')).toEqual(fakeAnchor);
		});
	});

	describe('simulateClick', () => {
		it('should add the downloadable pdf anchor element to the DOM, programmatically click it, then remove it', () => {
			const appendChildSpy = vi.spyOn(document.body, 'appendChild');
			const clickSpy = vi.spyOn(fakeAnchor as HTMLAnchorElement, 'click').mockImplementation(() => {});
			const removeChildSpy = vi.spyOn(document.body, 'removeChild');

			service.simulateClick(fakeAnchor as HTMLAnchorElement);

			expect(appendChildSpy).toHaveBeenCalled();
			expect(clickSpy).toHaveBeenCalled();
			expect(removeChildSpy).toHaveBeenCalled();
		});
	});
});
