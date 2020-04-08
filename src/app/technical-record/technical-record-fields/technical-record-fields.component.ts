import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { ControlContainer, FormGroupDirective, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'vtm-technical-record-fields',
  templateUrl: './technical-record-fields.component.html',
  styleUrls: ['./technical-record-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // viewProviders: [
  //   {
  //     provide: ControlContainer,
  //     useExisting: FormGroupDirective
  //   }
  // ]
})
export class TechnicalRecordFieldsComponent implements OnInit, OnDestroy {
  protected onDestroy$ = new Subject();
  technicalRecord: FormGroup;
  @Output() removeControl = new EventEmitter<string>();

  constructor(private parent: FormGroupDirective, protected fb: FormBuilder) {}

  ngOnInit() {
    this.technicalRecord = new FormGroup({});
  }

  setUp(): FormGroup {
    const group = this.parent.form.get('technicalRecord') as FormGroup;
    if (!group) {
      this.parent.form.addControl('technicalRecord', new FormGroup({}));
      return this.parent.form.get('technicalRecord') as FormGroup;
    }

    return group;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
