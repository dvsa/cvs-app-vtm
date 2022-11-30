import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { take, takeWhile } from 'rxjs';

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

  download() {
    return this.documentRetrievalService
      .testCertificateGet(this.testNumber, this.vin, 'events', true)
      .pipe(takeWhile(event => event.type !== HttpEventType.Response, true))
      .subscribe({
        next: res => {
          switch (res.type) {
            case HttpEventType.DownloadProgress:
              console.log(res);
              break;
            case HttpEventType.Response:
              const byteArray = new Uint8Array(
                window
                  .atob(res.body)
                  .split('')
                  .map(char => char.charCodeAt(0))
              );

              const file = new Blob([byteArray], { type: 'application/pdf; charset=utf-8' });
              const url = window.URL.createObjectURL(file);
              const link: HTMLAnchorElement | undefined = document.createElement('a');
              link.href = url;
              link.target = '_blank';
              link.download = `${this.testNumber}_${this.vin}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              this.isSuccess.emit(true);
          }
        },
        error: () => {
          this.isSuccess.emit(false);
        }
      });
  }

  viewPdf() {
    this.documentRetrievalService
      .testCertificateGet(this.testNumber, this.vin)
      .pipe(take(1))
      .subscribe(body => {
        const byteArray = new Uint8Array(
          window
            .atob(body)
            .split('')
            .map(char => char.charCodeAt(0))
        );

        const file = new Blob([byteArray], { type: 'application/pdf; charset=utf-8' });

        const url = window.URL.createObjectURL(file);
        this.pdfSrc = url;

        this.cdr.detectChanges();
      });
  }

  onLoadError(error: any) {
    console.log(error);
  }
}
