import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { AdrDetails } from '@app/models/adr-details';
import { TechRecord } from '@app/models/tech-record.model';
import { MetaData } from '@app/models/meta-data';
import { RADIOOPTIONS } from './adr.constants';
import { VIEW_STATE } from '@app/app.enums';
import { ValidationMapper } from './adr-validation.mapper';

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

  protected onDestroy$ = new Subject();

  @Input() params: { [key: string]: boolean };
  @Input() editAdrDetails: VIEW_STATE;
  @Input() activeRecord: TechRecord;
  @Input() vehicleMetaData: MetaData;
  @Output() removeAdrControl = new EventEmitter<string>();

  constructor(
    private parent: FormGroupDirective,
    protected fb: FormBuilder,
    protected validationMapper: ValidationMapper,
    protected detectChange: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { params } = changes;
    if (params) {
      this.showAdrView = params.currentValue.showAdrDetails;
    }
  }

  ngOnInit() {
    this.adrDetails = !!this.activeRecord.adrDetails
      ? this.activeRecord.adrDetails
      : ({} as AdrDetails);
  }

  protected setUp(): FormGroup {
    const group = this.parent.form.get('adrDetails') as FormGroup;
    if (!group) {
      this.parent.form.addControl('adrDetails', new FormGroup({}));
      return this.parent.form.get('adrDetails') as FormGroup;
    }

    return group;
  }

  switchAdrDisplay($event): void {
    this.showAdrView = $event.currentTarget.value === 'true';
    if (!this.showAdrView) {
      // remove ADR structure/record that was setup for editing
      this.removeAdrControl.emit('adrDetails');
    }
  }

  radioOptions() {
    return RADIOOPTIONS;
  }

  unsorted(): number {
    return 0;
  }

  protected vehicleTypeChangedHandler(selectedType: string): void {
    this.validationMapper.mapVehicleTypeToValidationState(selectedType);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
