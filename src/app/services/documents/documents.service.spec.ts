import { TestBed } from '@angular/core/testing';

import { DocumentsService } from './documents.service';

global.URL.createObjectURL = jest.fn().mockReturnValue('objectURL');

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openDocumentFromResponse', () => {
    it('should download a document sent back from a http response', () => {
      const convertToBlobSpy = jest.spyOn(service, 'convertToBlob');
      const createFileLinkSpy = jest.spyOn(service, 'createFileLink');
      const simulateClickSpy = jest.spyOn(service, 'simulateClick');

      service.openDocumentFromResponse(fileName, responseBody);

      expect(convertToBlobSpy).toHaveBeenCalledWith(responseBody);
      expect(createFileLinkSpy).toHaveBeenCalledWith(fileName, new Blob());
      expect(simulateClickSpy).toHaveBeenCalledWith(fakeAnchor);
    });
  });

  describe('convertToBlob', () => {
    it('should throw an error if the data provided is not a string', () => {
      expect(service.convertToBlob.bind(0)).toThrow();
      expect(service.convertToBlob.bind(null)).toThrow();
      expect(service.convertToBlob.bind(undefined)).toThrow();
    });

    it('should return a blob of type application/pdf based on the string provided', () => {
      expect(service.convertToBlob('')).toEqual(new Blob());
    });
  });

  describe('createFileLink', () => {
    it('should create a downloadable anchor link for a pdf file, using the file name and blob provided', () => {
      expect(service.createFileLink(fileName, new Blob())).toEqual(fakeAnchor);
    });
  });

  describe('simulateClick', () => {
    it('should add the downloadable pdf anchor element to the DOM, programmatically click it, then remove it', () => {
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const clickSpy = jest.spyOn(fakeAnchor as HTMLAnchorElement, 'click');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');

      service.simulateClick(fakeAnchor as HTMLAnchorElement);

      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });
  });
});
