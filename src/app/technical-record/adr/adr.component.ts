import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { AdrDetails } from '@app/models/adr-details';
import { TechRecord } from '@app/models/tech-record.model';
import { MetaData } from '@app/models/meta-data';
import { VIEW_STATE } from '@app/app.enums';
import { ValidationMapper } from './adr-validation.mapper';
import { BOOLEAN_RADIO_OPTIONS } from '../technical-record.constants';

@Component({
  selector: 'vtm-adr',
  templateUrl: './adr.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AdrComponent implements OnChanges, OnInit, OnDestroy {
  showAdrView: boolean;
  adrDetails: AdrDetails;
  metaData$: Observable<MetaData>;
  booleanOptions = BOOLEAN_RADIO_OPTIONS;

  protected onDestroy$ = new Subject();

  @Input() params: { [key: string]: boolean };
  @Input() editState: VIEW_STATE;
  @Input() activeRecord: TechRecord;
  @Input() vehicleMetaData: MetaData;

  constructor(
    private parent: FormGroupDirective,
    protected fb: FormBuilder,
    protected validationMapper: ValidationMapper,
    protected detectChange: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { params, activeRecord, editState } = changes;
    if (params) {
      this.showAdrView = params.currentValue.showAdrDetails;
    }

    if (activeRecord) {
      if (!!activeRecord.currentValue.adrDetails) {
        this.adrDetails = activeRecord.currentValue.adrDetails;
      } else {
        this.adrDetails = {} as AdrDetails;
      }
    }

    if (editState) {
      const techRecord = this.parent.form.get('techRecord') as FormGroup;
      techRecord.removeControl('adrDetails');
      techRecord.addControl('adrDetails', new FormGroup({}));
    }
  }

  ngOnInit() {}

  protected setUp(): FormGroup {
    return this.parent.form.get('techRecord.adrDetails') as FormGroup;
  }

  switchAdrDisplay($event): void {
    const techRecord = this.parent.form.get('techRecord') as FormGroup;
    this.showAdrView = $event.currentTarget.value === 'true';

    if (!this.showAdrView) {
      techRecord.removeControl('adrDetails');
    } else {
      techRecord.addControl('adrDetails', new FormGroup({}));
    }
  }

  unsorted(): number {
    return 0;
  }

  protected vehicleTypeChangedHandler(selectedType: string): void {
    this.validationMapper.vehicleTypeSelected(selectedType);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
