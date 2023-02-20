import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { LettersOfAuth } from '@api/vehicle/model/lettersOfAuth';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { LettersTemplate } from '@forms/templates/general/letters.template';
import { Roles } from '@models/roles.enum';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import { Subscription, debounceTime } from 'rxjs';

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

  get mostRecentLetter(): LettersOfAuth | undefined {
    return this.techRecord.lettersOfAuth && this.techRecord.lettersOfAuth[this.techRecord.lettersOfAuth.length - 1];
  }

  get documentParams(): Map<string, string> {
    return new Map([['letterContents', this.fileName]]);
  }

  get fileName(): string {
    if (this.mostRecentLetter) {
      return `letter_${this.mostRecentLetter.letterContents}`;
    } else {
      throw new Error('Could not find letter.');
    }
  }
}
