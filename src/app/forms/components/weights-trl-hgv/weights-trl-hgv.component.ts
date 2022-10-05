import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { WeightsComponent } from '../weights/weights.component';

@Component({
  selector: 'app-weights-trl-hgv[vehicleType]',
  templateUrl: './weights-trl-hgv.component.html'
})
export class WeightsTrlHgvComponent extends WeightsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleType!: string;

  constructor(public override dfs: DynamicFormService) {
    super(dfs);
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  override ngOnChanges() {
    super.ngOnChanges();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
