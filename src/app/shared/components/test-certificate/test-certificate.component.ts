import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { Observable, take, takeWhile } from 'rxjs';

@Component({
  selector: 'app-test-certificate[testNumber][vin]',
  templateUrl: './test-certificate.component.html',
  styleUrls: ['./test-certificate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestCertificateComponent {
  @Input() testNumber!: string;
  @Input() vin!: string;
  @Output() isSuccess = new EventEmitter<boolean>();

  pdfSrc: any = null;

  constructor(private documentRetrievalService: DocumentRetrievalService, private cdr: ChangeDetectorRef) {}

  handleDownload() {
    return this.documentRetrievalService
      .testCertificateGet(this.testNumber, this.vin)
      .pipe(take(1), this.base64ToObjectUrl())
      .subscribe({
        next: url => {
          this.download(url);
          this.isSuccess.emit(true);
        },
        error: () => {
          this.isSuccess.emit(false);
        }
      });
  }

  private download(url: string): void {
    const link: HTMLAnchorElement | undefined = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `${this.testNumber}_${this.vin}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  viewPdf() {
    this.documentRetrievalService
      .testCertificateGet(this.testNumber, this.vin)
      .pipe(take(1), this.base64ToObjectUrl())
      .subscribe(objectUrl => {
        this.pdfSrc = objectUrl;
        this.cdr.detectChanges();
      });
  }

  private toByteArray(b64String: string) {
    return new Uint8Array(
      window
        .atob(b64String)
        .split('')
        .map(c => c.charCodeAt(0))
    );
  }

  private createCertificateUrl(byteArray: Uint8Array) {
    return window.URL.createObjectURL(new Blob([byteArray], { type: 'application/pdf; charset=utf-8' }));
  }

  /**
   * Decodes the source base64 string into a [Uint8Array] and creates an Blob object URL.
   * @returns {string} Blob object URL
   */
  private base64ToObjectUrl() {
    return (source: Observable<string>): Observable<string> => {
      return new Observable(subscriber => {
        source.subscribe({
          next: val => subscriber.next(this.createCertificateUrl(this.toByteArray(val))),
          error: e => subscriber.error(e),
          complete: () => subscriber.complete()
        });
      });
    };
  }
}
