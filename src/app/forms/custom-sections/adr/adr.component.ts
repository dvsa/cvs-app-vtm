import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { AdrTemplate } from '@forms/templates/general/adr.template';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { AdrSummaryTemplate } from '@forms/templates/general/adr-summary.template';
import { AdrService } from '@services/adr/adr.service';
import { ReplaySubject, skipWhile, takeUntil } from 'rxjs';

@Component({
  selector: 'app-adr',
  templateUrl: './adr.component.html',
  styleUrls: ['./adr.component.scss'],
})
export class AdrComponent implements OnInit, OnDestroy {
  @Input() techRecord!: TechRecordType<'hgv' | 'lgv' | 'trl'>;
  @Input() isEditing = false;
  @Input() isReviewScreen = false;

  template!: FormNode;
  form!: CustomFormGroup;
  destroy$ = new ReplaySubject<boolean>(1);

  constructor(
    private dfs: DynamicFormService,
    private technicalRecordService: TechnicalRecordService,
    private globalErrorService: GlobalErrorService,
    public adrService: AdrService,
  ) { }

  ngOnInit(): void {
    this.template = this.isReviewScreen ? AdrSummaryTemplate : AdrTemplate;
    this.form = this.dfs.createForm(this.template, this.techRecord) as CustomFormGroup;
    this.techRecord.techRecord_adrDetails_dangerousGoods = this.adrService.carriesDangerousGoods(this.techRecord);
    if (this.techRecord.techRecord_adrDetails_dangerousGoods && !this.isReviewScreen) {
      this.techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select = this.adrService.determineTankStatementSelect(this.techRecord);
    }
    this.handleSubmit();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  handleFormChange(event: Record<string, unknown>) {
    if (event == null) return;
    if (this.techRecord == null) return;

    this.form.patchValue(event);
    this.technicalRecordService.updateEditingTechRecord({ ...this.techRecord, ...event } as TechRecordTypeVerb<'put'>);
  }

  get documentParams(): Map<string, string> {
    return new Map([['adrDocumentId', this.fileName]]);
  }

  get fileName(): string {
    if (this.hasAdrDocumentation()) {
      return this.techRecord.techRecord_adrDetails_documentId ?? '';
    }
    throw new Error('Could not find ADR Documentation.');
  }

  hasAdrDocumentation(): boolean {
    return !!this.techRecord.techRecord_adrDetails_documentId;
  }

  handleSubmit() {
    this.globalErrorService.errors$
      .pipe(takeUntil(this.destroy$), skipWhile((errors) => errors.length === 0))
      .subscribe(() => this.globalErrorService.focusAllControls());
  }
}
