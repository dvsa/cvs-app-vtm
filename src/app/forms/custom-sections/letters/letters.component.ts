import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { LettersTemplate } from '@forms/templates/general/letters.template';
import { Roles } from '@models/roles.enum';
import { LettersIntoAuthApprovalType, LettersOfAuth, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Subscription, debounceTime, take } from 'rxjs';

@Component({
  selector: 'app-letters[techRecord]',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss']
})
export class LettersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() techRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;
  vehicle?: VehicleTechRecordModel;

  private _formSubscription = new Subscription();

  constructor(private dynamicFormService: DynamicFormService, private technicalRecordService: TechnicalRecordService) {
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => (this.vehicle = vehicle));
  }

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
    return this.techRecord?.letterOfAuth ?? undefined;
  }

  get eligibleForLetter(): boolean {
    return (
      this.techRecord.approvalType !== undefined &&
      (Object.values(LettersIntoAuthApprovalType) as string[]).includes(this.techRecord.approvalType!.valueOf())
    );
  }

  get documentParams(): Map<string, string> {
    if (!this.vehicle) {
      throw new Error('Could not find vehicle record associated with this technical record.');
    }
    return new Map([
      ['systemNumber', this.vehicle!.systemNumber],
      ['vinNumber', this.vehicle!.vin]
    ]);
  }

  get fileName(): string {
    if (!this.letter) {
      return '';
    }
    if (!this.vehicle) {
      return '';
    }
    return `letter_${this.vehicle.systemNumber}_${this.vehicle.vin}`;
  }
}
