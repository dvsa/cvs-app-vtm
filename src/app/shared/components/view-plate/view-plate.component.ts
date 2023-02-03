import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-view-plate',
  templateUrl: './view-plate.component.html',
  styleUrls: ['./view-plate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPlateComponent {
  @Input() testNumber!: string;
  @Input() vin!: string;
  @Output() isSuccess = new EventEmitter<boolean>();

  constructor(private documentRetrievalService: DocumentRetrievalService) {}

  download() {
    console.log('Fetching plate');
    return this.documentRetrievalService
      .testPlateGet('123453', 'events', true)
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
}
