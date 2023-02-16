import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { LettersOfAuth } from '@api/vehicle/model/lettersOfAuth';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { LettersTemplate } from '@forms/templates/general/letters.template';
import { Roles } from '@models/roles.enum';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import { DocumentsService } from '@services/documents/documents.service';
import { Subscription, debounceTime, takeWhile } from 'rxjs';

@Component({
  selector: 'app-letters[vehicleTechRecord]',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss']
})
export class LettersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;

  private _formSubscription = new Subscription();

  constructor(
    private documentRetrievalService: DocumentRetrievalService,
    private documentsService: DocumentsService,
    private dynamicFormService: DynamicFormService
  ) {}

  ngOnInit(): void {
    this.form = this.dynamicFormService.createForm(LettersTemplate, this.vehicleTechRecord) as CustomFormGroup;
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

  download() {
    const mostRecentLetter = this.mostRecentLetter;

    if (!mostRecentLetter) throw new Error('Could not find letter.');

    return this.documentRetrievalService
      .testPlateGet(`plate_${mostRecentLetter.letterContents}`, 'events', true) // TODO: Use testLetterGet when it's implemented
      .pipe(takeWhile(event => event.type !== HttpEventType.Response, true))
      .subscribe({
        next: res => {
          switch (res.type) {
            case HttpEventType.DownloadProgress:
              console.log(res);
              break;
            case HttpEventType.Response:
              this.documentsService.openDocumentFromResponse(`plate_${mostRecentLetter.letterContents}`, res.body);
              break;
          }
        }
      });
  }
}
