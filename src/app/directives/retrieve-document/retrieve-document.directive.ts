import { HttpErrorResponse, HttpEventType, HttpStatusCode } from '@angular/common/http';
import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DocumentsService } from '@services/documents/documents.service';
import { HttpService } from '@services/http/http.service';
import { setSpinnerState } from '@store/spinner/spinner.actions';
import { takeWhile } from 'rxjs';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DocumentType } from '@models/document-type.enum';

@Directive({ selector: '[appRetrieveDocument][params][fileName]' })
export class RetrieveDocumentDirective {
	readonly params = input<Map<string, string>>(new Map());
	readonly fileName = input('');
	readonly loading = input<boolean>();
	readonly certNotNeeded = input(false);
	readonly fileType = input('pdf');
  readonly documentType = input<DocumentType>();

	private store = inject(Store);
	private httpService = inject(HttpService);
	private documentsService = inject(DocumentsService);
	private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private globalErrorService = inject(GlobalErrorService);

	@HostListener('click', ['$event']) clickEvent(event: PointerEvent) {
		if (this.certNotNeeded()) return;
		event.preventDefault();
		event.stopPropagation();

		if (this.loading()) {
			this.store.dispatch(setSpinnerState({ showSpinner: true }));
		}

		this.httpService
			.getDocument(this.params())
			.pipe(takeWhile((doc) => doc.type !== HttpEventType.Response, true))
			.subscribe({
        next: (response) => {
          switch (response.type) {
            case HttpEventType.DownloadProgress:
              break;
            case HttpEventType.Response:
              this.documentsService.openDocumentFromResponse(this.fileName(), response.body, this.fileType());
              this.markAsVisited();
              this.store.dispatch(setSpinnerState({ showSpinner: false }));
              break;
            default:
              break;
          }
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case HttpStatusCode.NotFound:
                this.globalErrorService.setErrors([
                  {
                    error: this.getErrorMessage(),
                    anchorLink: '',
                  },
                ]);
                break;
            }
          }
        }
      });
	}

  getErrorMessage(): string {
    return `${this.documentType()} could not be found. <br>Try again later or contact the service desk if this issue keeps happening.`;
  }

	markAsVisited() {
		if (this.elementRef.nativeElement.classList.contains('govuk-link-visited')) return;
		this.elementRef.nativeElement.classList.add('govuk-link-visited');
	}
}
