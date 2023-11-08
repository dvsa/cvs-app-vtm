import {
  Component,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { AdrTemplate } from '@forms/templates/general/adr.template';
import { CustomAsyncValidators } from '@forms/validators/custom-async-validators';
import { CustomValidators } from '@forms/validators/custom-validators';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Subject } from 'rxjs';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-adr',
  templateUrl: './adr.component.html',
  styleUrls: ['./adr.component.scss'],
})
export class AdrComponent implements OnInit {
  @Input() techRecord!: V3TechRecordModel;
  @Input() isEditing = false;
  @Input() disableLoadOptions = false;
  canCarry = false;

  public template = AdrTemplate;
  public form!: CustomFormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private dfs: DynamicFormService,
  ) { }

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.techRecord) as CustomFormGroup;

    this.form.controls['dangerous_goods'].valueChanges.subscribe((value) => {
      this.canCarry = value;
    });
  }

  get techRecord$() {
    return this.techRecord;
  }

  get editTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

}
