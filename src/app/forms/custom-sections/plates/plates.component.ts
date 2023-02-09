import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentRetrievalService } from '@api/document-retrieval';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { Roles } from '@models/roles.enum';
import { Plates, TechRecordModel } from '@models/vehicle-tech-record.model';
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
    this.form = this.dfs.createForm(this.template!, this.vehicleTechRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => this.formChange.emit(event));
  }

  ngOnChanges(): void {
    this.form?.patchValue(this.vehicleTechRecord, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get template(): FormNode | undefined {
    return PlatesTemplate;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get mostRecentPlate(): Plates | undefined {
    if (this.vehicleTechRecord.plates === undefined) return undefined;
    const justDates = this.vehicleTechRecord.plates!.map(x => x.plateIssueDate!.getTime());
    const maxDate = Math.max(...justDates);
    return this.vehicleTechRecord.plates![justDates.indexOf(maxDate)] ?? undefined;
  }

  get plateIssueDate(): Date | undefined {
    if (this.mostRecentPlate !== undefined) return this.mostRecentPlate?.plateIssueDate;
    return undefined;
  }

  get plateIssuer(): string | undefined {
    if (this.mostRecentPlate !== undefined) return this.mostRecentPlate.plateIssuer;
    return undefined;
  }

  get plateReasonForIssue(): string | undefined {
    if (this.mostRecentPlate !== undefined) return this.mostRecentPlate?.plateReasonForIssue;
    return undefined;
  }

  get plateSerialNumber(): string | undefined {
    if (this.mostRecentPlate !== undefined) return this.mostRecentPlate?.plateSerialNumber;
    return undefined;
  }

  download() {
    const mostRecentPlate = this.mostRecentPlate;
    if (mostRecentPlate !== undefined) {
      return this.documentRetrievalService
        .testPlateGet(mostRecentPlate.plateSerialNumber, 'events', true)
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
                link.download = `${mostRecentPlate.plateSerialNumber}.pdf`;
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
