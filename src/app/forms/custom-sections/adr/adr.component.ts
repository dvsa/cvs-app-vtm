import {
  Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';
import { AdrTemplate } from '@forms/templates/general/adr.template';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-adr',
  templateUrl: './adr.component.html',
  styleUrls: ['./adr.component.scss'],
})
export class AdrComponent implements OnInit {
  @Input() techRecord!: V3TechRecordModel;
  @Input() isEditing = false;
  @Input() disableLoadOptions = false;
  @Output() formChange = new EventEmitter();

  public template = AdrTemplate;
  public form!: CustomFormGroup;

  constructor(
    private dfs: DynamicFormService,
  ) { }

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.techRecord) as CustomFormGroup;
  }

  handleFormChange(event: Record<string, unknown>) {
    if (event == null) return;
    this.formChange.emit(event);
  }
}
