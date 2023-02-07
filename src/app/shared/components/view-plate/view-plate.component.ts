import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-view-plate',
  templateUrl: './view-plate.component.html',
  styleUrls: ['./view-plate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPlateComponent {
  @Input() currentTechRecord!: TechRecordModel;
  @Output() isSuccess = new EventEmitter<boolean>();

  constructor(private documentRetrievalService: DocumentRetrievalService) {}

  fetchLatestPlate() {
    const justDates = this.currentTechRecord.plates!.map(x => x.plateIssueDate!.getTime());
    const maxDate = Math.max(...justDates);
    console.log(justDates.indexOf(maxDate));
    return this.currentTechRecord.plates![justDates.indexOf(maxDate)] ?? null;
  }

  download() {
    const mostRecentPlate = this.fetchLatestPlate();
    if (mostRecentPlate !== null) {
      return this.documentRetrievalService
        .testPlateGet(mostRecentPlate.plateSerialNumber, 'events', true)
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
                link.download = `${mostRecentPlate.plateSerialNumber}.pdf`;
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

    throw new Error('Could not find plate.');
  }
}
