import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { Roles } from '@models/roles.enum';
import { Plates, TechRecordModel } from '@models/vehicle-tech-record.model';
import { DocumentsService } from '@services/documents/documents.service';
import cloneDeep from 'lodash.clonedeep';
import { debounceTime, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'app-plates[vehicleTechRecord]',
  templateUrl: './plates.component.html',
  styleUrls: ['./plates.component.scss']
})
export class PlatesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();
  @Output() isSuccess = new EventEmitter<boolean>();

  form!: CustomFormGroup;

  private _formSubscription = new Subscription();

  constructor(
    private documentRetrievalService: DocumentRetrievalService,
    private documentsService: DocumentsService,
    private dynamicFormService: DynamicFormService
  ) {}

  ngOnInit(): void {
    this.form = this.dynamicFormService.createForm(PlatesTemplate, this.vehicleTechRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => this.formChange.emit(event));
  }

  ngOnChanges(): void {
    this.form?.patchValue(this.vehicleTechRecord, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  hasPlates(): boolean {
    return this.vehicleTechRecord.plates !== undefined && this.vehicleTechRecord.plates.length > 0;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get mostRecentPlate(): Plates | undefined {
    return cloneDeep(this.vehicleTechRecord.plates)
      ?.sort((a, b) => (a.plateIssueDate && b.plateIssueDate ? new Date(a.plateIssueDate).getTime() - new Date(b.plateIssueDate).getTime() : 0))
      ?.pop();
  }

  download() {
    const mostRecentPlate = this.mostRecentPlate;
    if (!mostRecentPlate) {
      throw new Error('Could not find plate.');
    }

    return this.documentRetrievalService
      .testPlateGet(`plate_${mostRecentPlate.plateSerialNumber}`, 'events', true)
      .pipe(takeWhile(event => event.type !== HttpEventType.Response, true))
      .subscribe({
        next: res => {
          switch (res.type) {
            case HttpEventType.DownloadProgress:
              console.log(res);
              break;
            case HttpEventType.Response:
              this.documentsService.openDocumentFromResponse(`plate_${mostRecentPlate.plateSerialNumber}`, res.body);
              this.isSuccess.emit(true);
              break;
          }
        },
        error: () => this.isSuccess.emit(false)
      });
  }
}
