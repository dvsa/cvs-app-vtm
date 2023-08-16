import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { GETTRLTechnicalRecordV3Complete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { LettersTemplate } from '@forms/templates/general/letters.template';
import { Roles } from '@models/roles.enum';
import { LettersIntoAuthApprovalType, LettersOfAuth, StatusCodes, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-letters[techRecord]',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss']
})
export class LettersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() techRecord!: V3TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;

  private _formSubscription = new Subscription();

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dynamicFormService.createForm(LettersTemplate, this.techRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => this.formChange.emit(event));
  }

  ngOnChanges(): void {
    this.form?.patchValue(this.techRecord, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get letter(): LettersOfAuth | undefined {
    return (this.techRecord as GETTRLTechnicalRecordV3Complete)?.techRecord_letterOfAuth_letterType
      ? {
          letterType: (this.techRecord as GETTRLTechnicalRecordV3Complete)?.techRecord_letterOfAuth_letterType!,
          paragraphId: (this.techRecord as GETTRLTechnicalRecordV3Complete)?.techRecord_letterOfAuth_paragraphId!,
          letterIssuer: (this.techRecord as GETTRLTechnicalRecordV3Complete)?.techRecord_letterOfAuth_letterIssuer!,
          letterDateRequested: (this.techRecord as GETTRLTechnicalRecordV3Complete)?.techRecord_letterOfAuth_letterDateRequested!,
          letterContents: ''
        }
      : undefined;
  }

  get eligibleForLetter(): boolean {
    const currentTechRecord = this.techRecord.techRecord_statusCode === StatusCodes.CURRENT;

    return this.correctApprovalType && currentTechRecord && !this.isEditing;
  }

  get reasonForIneligibility(): string {
    if (this.isEditing) {
      return 'This section is not available when amending or creating a technical record.';
    }

    if (this.techRecord.techRecord_statusCode !== StatusCodes.CURRENT) {
      return 'Generating letters is only applicable to current technical records.';
    }

    if (!this.correctApprovalType) {
      return 'This trailer does not have the right approval type to be eligible for a letter of authorisation.';
    }

    return '';
  }

  get correctApprovalType(): boolean {
    return (
      (this.techRecord as any).techRecord_approvalType !== undefined &&
      (Object.values(LettersIntoAuthApprovalType) as string[]).includes((this.techRecord as any).techRecord_approvalType!.valueOf())
    );
  }

  get documentParams(): Map<string, string> {
    if (!this.techRecord) {
      throw new Error('Could not find vehicle record associated with this technical record.');
    }
    return new Map([
      ['systemNumber', this.techRecord.systemNumber],
      ['vinNumber', this.techRecord.vin]
    ]);
  }

  get fileName(): string {
    if (!this.letter) {
      return '';
    }
    if (!this.techRecord) {
      return '';
    }
    return `letter_${this.techRecord.systemNumber}_${this.techRecord.vin}`;
  }
}
