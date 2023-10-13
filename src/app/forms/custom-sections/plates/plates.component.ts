import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { HGVPlates } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TRLPlates } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { Roles } from '@models/roles.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { cloneDeep } from 'lodash';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-plates[techRecord]',
  templateUrl: './plates.component.html',
  styleUrls: ['./plates.component.scss'],
})
export class PlatesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() techRecord!: TechRecordType<'trl'> | TechRecordType<'hgv'>;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;
  pageStart?: number;
  pageEnd?: number;

  private formSubscription = new Subscription();

  constructor(private dynamicFormService: DynamicFormService, private cdr: ChangeDetectorRef) {}

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
    return cloneDeep(this.techRecord.techRecord_plates)?.sort((a: any, b: any) =>
      a.plateIssueDate && b.plateIssueDate ? new Date(b.plateIssueDate).getTime() - new Date(a.plateIssueDate).getTime() : 0);
  }

  get plates() {
    return this.sortedPlates?.slice(this.pageStart, this.pageEnd) ?? [];
  }

  get mostRecentPlate(): any | undefined {
    return cloneDeep(this.techRecord.techRecord_plates)
      ?.sort((a: any, b: any) =>
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
}
