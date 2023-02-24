import { HttpClient } from '@angular/common/http';
import { Configuration, DocumentRetrievalService } from '@api/document-retrieval';
import { DocumentsService } from '@services/documents/documents.service';
import { RetrieveDocumentDirective } from './retrieve-document.directive';

describe('RetrieveDocumentDirective', () => {
  it('should create an instance', () => {
    const directive = new RetrieveDocumentDirective(new DocumentRetrievalService({} as HttpClient, '', new Configuration()), new DocumentsService());
    expect(directive).toBeTruthy();
  });
});
