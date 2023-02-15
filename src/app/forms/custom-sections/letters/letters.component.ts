import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { LettersTemplate } from '@forms/templates/general/letters.template';
import { Roles } from '@models/roles.enum';
import { Axle, Letters, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { debounceTime, Subscription } from 'rxjs';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { ActivatedRoute, Router } from '@angular/router';

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

  get mostRecentLetter(): Letters | undefined {
    return this.vehicleTechRecord.letters && this.vehicleTechRecord.letters[this.vehicleTechRecord.letters.length - 1];
  }

  download() {
    console.log('Ping');
  }
}
