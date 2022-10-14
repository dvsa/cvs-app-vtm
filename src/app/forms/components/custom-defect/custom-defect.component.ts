import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-custom-defect[index]',
  templateUrl: './custom-defect.component.html',
  styleUrls: ['./custom-defect.component.scss']
})
export class CustomDefectComponent implements OnInit {
  @Input() form!: CustomFormGroup;
  @Input() isEditing = false;
  @Input() index!: number;
  @Output() removeCustomDefect = new EventEmitter<number>();

  isEditingCustomDefect: boolean = false;
  sectionFormValues!: CustomFormGroup;

  ngOnInit(): void {
    this.updateSectionFormValues();
  }

  updateSectionFormValues(): void {
    this.sectionFormValues = this.form.value;
  }
}
