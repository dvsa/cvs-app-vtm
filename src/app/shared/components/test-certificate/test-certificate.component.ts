import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { RouterService } from '@services/router/router.service';
import { combineLatest, map, Observable, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-test-certificate',
  templateUrl: './test-certificate.component.html',
  styleUrls: ['./test-certificate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestCertificateComponent {
  @Input() render: string = '';
  constructor(private routerService: RouterService, private documentRetrievalService: DocumentRetrievalService) {}

  get testNumber$(): Observable<string | undefined> {
    return this.routerService.routeNestedParams$.pipe(map(params => params['testNumber']));
  }
  get vin$(): Observable<string | undefined> {
    return this.routerService.routeNestedParams$.pipe(map(params => params['vin']));
  }

  download() {
    combineLatest([this.testNumber$, this.vin$])
      .pipe(
        take(1),
        switchMap(([testNumber, vin]) => {
          return this.documentRetrievalService.testCertificateGet(testNumber, vin);
        })
      )
      .subscribe({
        next: doc => {
          console.log(doc);
          const { name, data } = doc;
          const link: HTMLAnchorElement | undefined = document.createElement('a');
          link.download = name;
          link.href = URL.createObjectURL(data);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        error: e => {
          console.error(e);
        }
      });
  }
}
