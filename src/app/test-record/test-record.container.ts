import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import {
  getTestViewState,
  selectTestTypeById
} from '@app/store/selectors/VehicleTestResultModel.selectors';
import { ActivatedRoute } from '@angular/router';
import { TestRecordMapper, TestTypesApplicable } from '@app/test-record/test-record.mapper';
import { Preparer } from '@app/models/preparer';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultModel } from '@app/models/test-result.model';
import {
  SetTestViewState,
  UpdateTestResult,
  DownloadCertificate,
  ArchiveTestResult
} from '@app/store/actions/VehicleTestResultModel.actions';
import { TestStation } from '@app/models/test-station';
import { getPreparers, getTestStations } from '@app/store/selectors/ReferenceData.selectors';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { LoadModal } from '../modal/modal.actions';
import { APP_MODALS } from '../app.enums';
import { getModalPayload } from '@app/modal/modal.selectors';

@Component({
  selector: 'vtm-test-record-container',
  template: `
    <ng-container *ngIf="testRecord$ | async as testResultObj">
      <vtm-test-record
        [testResultObj]="testResultObj"
        [preparers]="preparers$ | async"
        [editState]="editState$ | async"
        [testStations]="testStations$ | async"
        [testTypesApplicable]="this.testTypesApplicable"
        [reasonForArchive]="this.reasonForArchive$ | async"
        (submitTest)="onTestSubmit($event)"
        (switchState)="currentStateHandler($event)"
        (downloadCert)="downloadCertificate($event)"
        (openReasonModal)="openArchivedConfirmation()"
        (archiveTest)="archiveTestResult($event)"
      >
      </vtm-test-record>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordContainer implements OnInit {
  testRecord$: Observable<TestRecordTestType>;
  preparers$: Observable<Preparer[]>;
  editState$: Observable<VIEW_STATE>;
  testStations$: Observable<TestStation[]>;
  reasonForArchive$: Observable<string>;
  testTypesApplicable: TestTypesApplicable;
  isFormDirty: boolean;
  testTypeNumber: string;

  constructor(
    private store: Store<IAppState>,
    private route: ActivatedRoute,
    private testRecordMapper: TestRecordMapper
  ) {}

  ngOnInit(): void {
    this.testTypesApplicable = {
      seatBeltApplicable: this.testRecordMapper.getTestTypeApplicable('seatBeltApplicable'),
      defectsApplicable: this.testRecordMapper.getTestTypeApplicable('defectsApplicable'),
      emissionDetailsApplicable: this.testRecordMapper.getTestTypeApplicable(
        'emissionDetailsApplicable'
      ),
      anniversaryDateApplicable: this.testRecordMapper.getTestTypeApplicable(
        'anniversaryDateApplicable'
      ),
      expiryDateApplicable: this.testRecordMapper.getTestTypeApplicable('expiryDateApplicable'),
      certificateApplicable: this.testRecordMapper.getTestTypeApplicable('certificateApplicable'),
      specialistTestApplicable: this.testRecordMapper.getTestTypeApplicable(
        'specialistTestApplicable'
      ),
      specialistCertificateApplicable: this.testRecordMapper.getTestTypeApplicable(
        'specialistCertificateApplicable'
      ),
      specialistCOIFApplicable: this.testRecordMapper.getTestTypeApplicable(
        'specialistCOIFApplicable'
      )
    };

    this.route.paramMap.subscribe((params) => {
      this.testTypeNumber = params.get('id');
      this.testRecord$ = this.store.select(selectTestTypeById(this.testTypeNumber));
    });
    this.preparers$ = this.store.select(getPreparers);
    this.editState$ = this.store.select(getTestViewState);
    this.testStations$ = this.store.select(getTestStations);
    this.reasonForArchive$ = this.store.select(getModalPayload);
  }

  onTestSubmit(testResultUpdated: TestResultModel) {
    const testResultTestTypeNumber: TestResultTestTypeNumber = {
      testResultUpdated: testResultUpdated,
      testTypeNumber: this.testTypeNumber,
      testResultsUpdated: {} as TestResultModel[]
    };

    this.store.dispatch(new UpdateTestResult(testResultTestTypeNumber));
  }

  currentStateHandler(state: VIEW_STATE) {
    this.store.dispatch(new SetTestViewState(state));
  }

  downloadCertificate(fileName: string) {
    this.store.dispatch(new DownloadCertificate(fileName));
  }

  openArchivedConfirmation() {
    this.store.dispatch(new LoadModal({ currentModal: APP_MODALS.REASON_FOR_DELETED }));
  }

  archiveTestResult(testResultToUpdate: TestResultModel) {
    this.store.dispatch(new ArchiveTestResult(testResultToUpdate));
  }
}
