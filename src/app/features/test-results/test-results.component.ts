import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss']
})
export class TestResultsComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private testRecordsService: TestRecordsService, private route: ActivatedRoute) {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const systemId = params.get('systemId') ?? '';

      this.testRecordsService.loadTestResultBySystemId(systemId);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
