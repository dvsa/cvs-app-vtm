import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { Roles } from '@models/roles.enum';
import { Plates, TechRecordModel } from '@models/vehicle-tech-record.model';
import { cloneDeep } from 'lodash';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-plates[techRecord]',
  templateUrl: './plates.component.html',
  styleUrls: ['./plates.component.scss']
})
export class PlatesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() techRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;

  private _formSubscription = new Subscription();

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dynamicFormService.createForm(PlatesTemplate, this.techRecord) as CustomFormGroup;
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

  get hasPlates(): boolean {
    return this.techRecord.plates !== undefined && this.techRecord.plates.length > 0;
  }

  get mostRecentPlate(): Plates | undefined {
    return cloneDeep(this.techRecord.plates)
      ?.sort((a, b) => (a.plateIssueDate && b.plateIssueDate ? new Date(a.plateIssueDate).getTime() - new Date(b.plateIssueDate).getTime() : 0))
      ?.pop();
  }

  get documentParams(): Map<string, string> {
    return new Map([['plateSerialNumber', this.fileName]]);
  }

  get fileName(): string {
    if (this.mostRecentPlate) {
      return `plate_${this.mostRecentPlate.plateSerialNumber}`;
    } else {
      throw new Error('Could not find plate.');
    }
  }
}
