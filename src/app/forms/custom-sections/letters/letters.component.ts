import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
} from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeVehicleVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { LettersTemplate } from '@forms/templates/general/letters.template';
import { Roles } from '@models/roles.enum';
import { LettersIntoAuthApprovalType, LettersOfAuth, StatusCodes } from '@models/vehicle-tech-record.model';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-letters[techRecord]',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss'],
})
export class LettersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() techRecord?: TechRecordType<'trl'>;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;

  private _formSubscription = new Subscription();

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dynamicFormService.createForm(LettersTemplate, this.techRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe((event) => this.formChange.emit(event));
  }

  ngOnChanges(): void {
    if (this.techRecord) {
      this.form?.patchValue(this.techRecord, { emitEvent: false });
    }
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
    return this.techRecord?.techRecord_letterOfAuth_letterType
      ? {
        letterType: this.techRecord?.techRecord_letterOfAuth_letterType,
        paragraphId: this.techRecord?.techRecord_letterOfAuth_paragraphId!,
        letterIssuer: this.techRecord?.techRecord_letterOfAuth_letterIssuer!,
        letterDateRequested: this.techRecord?.techRecord_letterOfAuth_letterDateRequested!,
        letterContents: '',
      }
      : undefined;
  }

  get eligibleForLetter(): boolean {
    const currentTechRecord = this.techRecord?.techRecord_statusCode === StatusCodes.CURRENT;

    return this.correctApprovalType && currentTechRecord && !this.isEditing;
  }

  get reasonForIneligibility(): string {
    if (this.isEditing) {
      return 'This section is not available when amending or creating a technical record.';
    }

    if (this.techRecord?.techRecord_statusCode !== StatusCodes.CURRENT) {
      return 'Generating letters is only applicable to current technical records.';
    }

    if (!this.correctApprovalType) {
      return 'This trailer does not have the right approval type to be eligible for a letter of authorisation.';
    }

    return '';
  }

  get correctApprovalType(): boolean {
    return (
      !!this.techRecord?.techRecord_approvalType
      && (Object.values(LettersIntoAuthApprovalType) as string[]).includes(this.techRecord.techRecord_approvalType.valueOf())
    );
  }

  get documentParams(): Map<string, string> {
    if (!this.techRecord) {
      throw new Error('Could not find vehicle record associated with this technical record.');
    }
    return new Map([
      ['systemNumber', (this.techRecord as TechRecordTypeVehicleVerb<'trl', 'get'>)?.systemNumber],
      ['vinNumber', this.techRecord?.vin],
    ]);
  }

  get fileName(): string {
    if (!this.letter) {
      return '';
    }
    if (!this.techRecord) {
      return '';
    }
    return `letter_${(this.techRecord as TechRecordTypeVehicleVerb<'trl', 'get'>).systemNumber}_${this.techRecord.vin}`;
  }
}
