import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { formatData } from '@store/test-types/selectors/test-types.selectors';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-test-type-select',
  templateUrl: './test-type-select.component.html',
  styleUrls: ['./test-type-select.component.scss']
})
export class TestTypeSelectComponent implements OnInit, OnDestroy {
  @Input() isEditing = false;
  @Input() template!: FormNode;
  @Input() data: any = {};
  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;
  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService, private store: Store<State>) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.data) as CustomFormGroup;
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(e => this.formChange.emit(e));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicleTypes$(): Observable<{ [key: string]: Array<{ name: string; id: string }> }> {
    return this.store.pipe(select(formatData));
  }
}
