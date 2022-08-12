import { Component, Input, OnInit } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-vehicle-header',
  templateUrl: './vehicle-header.component.html',
  styleUrls: ['./vehicle-header.component.scss']
})
export class VehicleHeaderComponent implements OnInit {
  @Input() template!: FormNode;
  @Input() data: any = {};
  @Input() isEditing = false;
  @Input() techRecord?: TechRecordModel | null | undefined;

  form!: CustomFormGroup;

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
  }

  getControl(path: string) {
    return this.form.get(path);
  }
}
