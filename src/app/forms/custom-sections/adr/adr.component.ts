import {
  Component, EventEmitter,
  Input, OnChanges, OnDestroy,
  OnInit, Output, SimpleChanges,
} from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { AdrTemplate } from '@forms/templates/general/adr.template';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-adr',
  templateUrl: './adr.component.html',
  styleUrls: ['./adr.component.scss'],
})
export class AdrComponent implements OnInit, OnDestroy {
  @Input() techRecord!: V3TechRecordModel;
  @Input() isEditing = false;
  @Input() disableLoadOptions = false;
  @Output() formChange = new EventEmitter();

  public template = AdrTemplate;
  public form!: CustomFormGroup;
  private formSubscription = new Subscription();

  constructor(
    private dfs: DynamicFormService,
  ) { }

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.techRecord) as CustomFormGroup;
    this.formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe((event) => this.formChange.emit(event));
  }

  get techRecord$() {
    return this.techRecord;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { techRecord } = changes;
    this.form?.patchValue(techRecord.currentValue, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }
}
