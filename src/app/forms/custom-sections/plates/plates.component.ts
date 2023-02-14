import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { Roles } from '@models/roles.enum';
import { Plates, TechRecordModel } from '@models/vehicle-tech-record.model';
import cloneDeep from 'lodash.clonedeep';
import { debounceTime, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'app-plates',
  templateUrl: './plates.component.html',
  styleUrls: ['./plates.component.scss']
})
export class PlatesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();
  @Output() isSuccess = new EventEmitter<boolean>();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();
  public isError: boolean = false;
  public errorMessage?: string;

  constructor(
    public dfs: DynamicFormService,
    private documentRetrievalService: DocumentRetrievalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(PlatesTemplate, this.vehicleTechRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => this.formChange.emit(event));
  }

  ngOnChanges(): void {
    this.form?.patchValue(this.vehicleTechRecord, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  hasPlates(): boolean {
    return this.vehicleTechRecord.plates !== undefined && this.vehicleTechRecord.plates.length > 0;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get mostRecentPlate(): Plates | undefined {
    const platesList = cloneDeep(this.vehicleTechRecord.plates);
    return platesList
      ?.sort((a, b) => (a.plateIssueDate && b.plateIssueDate ? new Date(a.plateIssueDate).getTime() - new Date(b.plateIssueDate).getTime() : 0))
      ?.pop();
  }

  download() {
    const mostRecentPlate = this.mostRecentPlate;
    if (mostRecentPlate) {
      return this.documentRetrievalService
        .testPlateGet(`plate_${mostRecentPlate.plateSerialNumber}`, 'events', true)
        .pipe(takeWhile(event => event.type !== HttpEventType.Response, true))
        .subscribe({
          next: res => {
            switch (res.type) {
              case HttpEventType.DownloadProgress:
                console.log(res);
                break;
              case HttpEventType.Response:
                const byteArray = new Uint8Array(
                  window
                    .atob(res.body)
                    .split('')
                    .map(char => char.charCodeAt(0))
                );

                const file = new Blob([byteArray], { type: 'application/pdf; charset=utf-8' });
                const url = window.URL.createObjectURL(file);
                const link: HTMLAnchorElement | undefined = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.download = `plate_${mostRecentPlate.plateSerialNumber}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                this.isSuccess.emit(true);
            }
          },
          error: () => {
            this.isSuccess.emit(false);
          }
        });
    }

    throw new Error('Could not find plate.');
  }

  generatePlate(): void {
    this.router.navigate(['generate-plate'], { relativeTo: this.route });
  }
}
