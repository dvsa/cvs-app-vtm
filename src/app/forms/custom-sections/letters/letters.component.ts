import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { LettersTemplate } from '@forms/templates/general/letters.template';
import { Roles } from '@models/roles.enum';
import { LettersIntoAuthApprovalType, LettersOfAuth, TechRecordModel } from '@models/vehicle-tech-record.model';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-letters',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss']
})
export class LettersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();

  constructor(public dfs: DynamicFormService, private documentRetrievalService: DocumentRetrievalService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(LettersTemplate, this.vehicleTechRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => this.formChange.emit(event));
  }

  ngOnChanges(): void {
    this.form?.patchValue(this.vehicleTechRecord, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get mostRecentLetter(): LettersOfAuth | undefined {
    return this.vehicleTechRecord.lettersOfAuth && this.vehicleTechRecord.lettersOfAuth[this.vehicleTechRecord.lettersOfAuth.length - 1];
  }

  get eligibleForLetter(): boolean {
    return this.vehicleTechRecord.approvalType !== undefined && this.vehicleTechRecord.approvalType.valueOf() in LettersIntoAuthApprovalType;
  }

  download() {
    console.log('Ping');
  }
}
