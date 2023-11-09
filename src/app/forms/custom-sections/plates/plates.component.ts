import { ViewportScroller } from '@angular/common';
import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { HGVAxles, HGVPlates } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TRLPlates } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { axleRequiredFields, hgvRequiredFields, trlRequiredFields } from '@forms/models/plateRequiredFields.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { Roles } from '@models/roles.enum';
import { HgvOrTrl, StatusCodes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { canGeneratePlate, updateScrollPosition } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { cloneDeep } from 'lodash';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-plates[techRecord]',
  templateUrl: './plates.component.html',
  styleUrls: ['./plates.component.scss'],
})
export class PlatesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() techRecord!: HgvOrTrl;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;
  pageStart?: number;
  pageEnd?: number;

  private formSubscription = new Subscription();

  constructor(
    private dynamicFormService: DynamicFormService,
    private cdr: ChangeDetectorRef,
    private globalErrorService: GlobalErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<TechnicalRecordServiceState>,
    private viewportScroller: ViewportScroller,
  ) {}

  ngOnInit(): void {
    this.form = this.dynamicFormService.createForm(PlatesTemplate, this.techRecord) as CustomFormGroup;
    this.formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe((event) => this.formChange.emit(event));
  }

  ngOnChanges(): void {
    this.form?.patchValue(this.techRecord, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get hasPlates(): boolean {
    return !!this.techRecord.techRecord_plates?.length;
  }

  get sortedPlates(): HGVPlates[] | TRLPlates[] | undefined {
    return cloneDeep(this.techRecord.techRecord_plates)?.sort((a, b) =>
      a.plateIssueDate && b.plateIssueDate ? new Date(b.plateIssueDate).getTime() - new Date(a.plateIssueDate).getTime() : 0);
  }

  get plates() {
    return this.sortedPlates?.slice(this.pageStart, this.pageEnd) ?? [];
  }

  get mostRecentPlate() {
    return cloneDeep(this.techRecord.techRecord_plates)
      ?.sort((a, b) =>
        a.plateIssueDate && b.plateIssueDate ? new Date(a.plateIssueDate).getTime() - new Date(b.plateIssueDate).getTime() : 0)
      ?.pop();
  }

  get numberOfPlates(): number {
    return this.sortedPlates?.length || 0;
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }

  trackByFn(i: number, tr: HGVPlates | TRLPlates) {
    return tr.plateIssueDate;
  }

  get documentParams(): Map<string, string> {
    return new Map([['plateSerialNumber', this.fileName]]);
  }

  get fileName(): string {
    if (this.mostRecentPlate) {
      return `plate_${this.mostRecentPlate.plateSerialNumber}`;
    }
    throw new Error('Could not find plate.');
  }

  get eligibleForPlates(): boolean {
    return this.techRecord.techRecord_statusCode === StatusCodes.CURRENT && !this.isEditing;
  }

  get reasonForIneligibility(): string {
    if (this.isEditing) {
      return 'This section is not available when amending or creating a technical record.';
    }

    if (this.techRecord.techRecord_statusCode !== StatusCodes.CURRENT) {
      return 'Generating plates is only applicable to current technical records.';
    }
    return '';
  }

  validateTechRecordPlates(): void {
    this.globalErrorService.clearErrors();
    const plateValidationTable = this.techRecord.techRecord_vehicleType === 'trl' ? trlRequiredFields : hgvRequiredFields;

    if (this.cannotGeneratePlate(plateValidationTable)) {
      this.viewportScroller.scrollToPosition([0, 0]);
      this.globalErrorService.addError({ error: 'All fields marked plate are mandatory to generate a plate.' });
      return;
    }
    this.store.dispatch(canGeneratePlate());
    this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
    void this.router.navigate(['generate-plate'], { relativeTo: this.route });
  }

  private cannotGeneratePlate(plateRequiredFields: string[]): boolean {
    const isOneFieldEmpty = plateRequiredFields.some((field) => {
      const value = this.techRecord[field as keyof HgvOrTrl];
      return value === undefined || value === null || value === '';
    });
    const areAxlesInvalid = this.techRecord.techRecord_axles?.some((axle) =>
      axleRequiredFields.some((field) => {
        const value = axle[field as keyof HGVAxles];
        return value === undefined || value === null || value === '';
      }));

    return isOneFieldEmpty || !this.techRecord.techRecord_axles?.length || !!areAxlesInvalid;
  }
}
