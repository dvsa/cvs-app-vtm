import { HttpEventType } from '@angular/common/http';
import { Directive, HostListener, Input } from '@angular/core';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { DocumentsService } from '@services/documents/documents.service';
import { takeWhile } from 'rxjs';

@Directive({ selector: '[appRetrieveDocument][params][fileName]' })
export class RetrieveDocumentDirective {
  @Input() params: Map<string, string> = new Map();
  @Input() fileName: string = '';

  constructor(private documentRetrievalService: DocumentRetrievalService, private documentsService: DocumentsService) {}

  @HostListener('click', ['$event']) clickEvent(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.documentRetrievalService
      .getDocument(this.params)
      .pipe(takeWhile(event => event.type !== HttpEventType.Response, true))
      .subscribe(response => {
        switch (response.type) {
          case HttpEventType.DownloadProgress:
            console.log(response);
            break;
          case HttpEventType.Response:
            this.documentsService.openDocumentFromResponse(this.fileName, response.body);
            break;
        }
      });
  }
}
