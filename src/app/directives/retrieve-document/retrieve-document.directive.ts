import { HttpEventType } from '@angular/common/http';
import { Directive, HostListener, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DocumentsService } from '@services/documents/documents.service';
import { HttpService } from '@services/http/http.service';
import { setSpinnerState } from '@store/spinner/spinner.actions';
import { takeWhile } from 'rxjs';

@Directive({ selector: '[appRetrieveDocument][params][fileName]' })
export class RetrieveDocumentDirective {
	@Input() params: Map<string, string> = new Map();
	@Input() fileName = '';
	@Input() loading?: boolean;
	@Input() certNotNeeded = false;
	@Input() fileType = 'pdf';

	private store = inject(Store);
	private httpService = inject(HttpService);
	private documentsService = inject(DocumentsService);

	@HostListener('click', ['$event']) clickEvent(event: PointerEvent) {
		if (this.certNotNeeded) return;
		event.preventDefault();
		event.stopPropagation();

		if (this.loading) {
			this.store.dispatch(setSpinnerState({ showSpinner: true }));
		}

		this.httpService
			.getDocument(this.params)
			.pipe(takeWhile((doc) => doc.type !== HttpEventType.Response, true))
			.subscribe((response) => {
				switch (response.type) {
					case HttpEventType.DownloadProgress:
						break;
					case HttpEventType.Response:
						this.documentsService.openDocumentFromResponse(this.fileName, response.body, this.fileType);
						this.store.dispatch(setSpinnerState({ showSpinner: false }));
						break;
					default:
						break;
				}
			});
	}
}
