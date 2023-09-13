import { AfterContentInit, ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { BaseControlComponent } from '../base-control/base-control.component';
import { CustomFormGroup, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

type Segments = {
  approvalTypeNumber1: Observable<string | undefined>;
  approvalTypeNumber2: Observable<string | undefined>;
  approvalTypeNumber3: Observable<string | undefined>;
  approvalTypeNumber4?: Observable<string | undefined>;
};

@Component({
  selector: './app-approval-type-input',
  templateUrl: './approval-type.component.html',
  styleUrls: ['./approval-type.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ApprovalTypeInputComponent,
      multi: true
    }
  ]
})
export class ApprovalTypeInputComponent extends BaseControlComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() isEditing = false;
  @Input() approvalType?: string;
  @Input() approvalTypeChange: boolean | undefined;

  private approvalTypeNumber1_: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private approvalTypeNumber2_: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private approvalTypeNumber3_: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private approvalTypeNumber4_: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private approvalTypeNumber1$: Observable<string | undefined>;
  private approvalTypeNumber2$: Observable<string | undefined>;
  private approvalTypeNumber3$: Observable<string | undefined>;
  private approvalTypeNumber4$: Observable<string | undefined>;
  private subscriptions: Array<Subscription | undefined> = [];
  public errors?: {
    error: boolean;
    errors?: {
      error: boolean;
      reason: string;
      index: number;
    }[];
  };
  protected formSubmitted? = false;

  public approvalTypeNumber1?: string;
  public approvalTypeNumber2?: string;
  public approvalTypeNumber3?: string;
  public approvalTypeNumber4?: string;

  constructor(injector: Injector, changeDetectorRef: ChangeDetectorRef, public globalErrorService: GlobalErrorService) {
    super(injector, changeDetectorRef);
    this.approvalTypeNumber1$ = this.approvalTypeNumber1_.asObservable();
    this.approvalTypeNumber2$ = this.approvalTypeNumber2_.asObservable();
    this.approvalTypeNumber3$ = this.approvalTypeNumber3_.asObservable();
    this.approvalTypeNumber4$ = this.approvalTypeNumber4_.asObservable();
    this.globalErrorService.errors$.subscribe((globalErrors: any) => {
      if (globalErrors.length) {
        this.formSubmitted = true;
        console.log(globalErrors);
      }
    });
  }

  validate() {
    switch (this.approvalType) {
      //1
      case 'NTA':
      case 'IVA':
      case 'IVA - DVSA/NI':
        if (!this.approvalTypeNumber1 && this.approvalType != null) {
          this.errors = {
            error: true,
            errors: [
              {
                error: true,
                reason: 'Approval type number is required with Approval type',
                index: 0
              }
            ]
          };
        }
        break;

      //4
      case 'GB WVTA':
      case 'EU WVTA Pre 23':
      case 'EU WVTA 23 on':
      case 'Prov.GB WVTA':
      case 'QNIG':
      case 'ECSSTA':
        if (
          !this.approvalTypeNumber1 ||
          !this.approvalTypeNumber2 ||
          !this.approvalTypeNumber3 ||
          (!this.approvalTypeNumber4 && this.approvalType != null)
        ) {
          this.errors = {
            error: true,
            errors: [
              {
                error: true,
                reason: 'Approval type number is required with Approval type',
                index: 0
              }
            ]
          };
        }
        break;

      //3
      case 'ECTA':
      case 'UKNI WVTA':
      case 'IVA - VCA':
        if (!this.approvalTypeNumber1 || !this.approvalTypeNumber2 || (!this.approvalTypeNumber3 && this.approvalType != null)) {
          this.errors = {
            error: true,
            errors: [
              {
                error: true,
                reason: 'Approval type number is required with Approval type',
                index: 0
              }
            ]
          };
        }
        break;

      //2
      case 'Small series':
      case 'NSSTA':
        if (!this.approvalTypeNumber1 || (!this.approvalTypeNumber2 && this.approvalType != null)) {
          this.errors = {
            error: true,
            errors: [
              {
                error: true,
                reason: 'Approval type number is required with Approval type',

                index: 0
              }
            ]
          };
        }
        break;
      default:
        break;
    }
  }

  ngOnChanges(): void {
    console.log(this.approvalTypeChange);
    if (!this.formSubmitted && this.approvalTypeChange) {
      this.clearInput();
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.subscribeAndPropagateChanges());
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.valueWriteBack(this.value);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s && s.unsubscribe());
  }

  onTechRecord_approvalTypeNumber1_Change(event: any) {
    this.approvalTypeNumber1_.next(event);
  }

  onTechRecord_approvalTypeNumber2_Change(event: any) {
    this.approvalTypeNumber2_.next(event);
  }

  onTechRecord_approvalTypeNumber3_Change(event: any) {
    this.approvalTypeNumber3_.next(event);
  }

  onTechRecord_approvalTypeNumber4_Change(event: any) {
    this.approvalTypeNumber4_.next(event);
  }

  valueWriteBack(value: string | null): void {
    if (value) {
      this.approvalTypeNumber1_.next(this.approvalTypeNumber1);
      this.approvalTypeNumber2_.next(this.approvalTypeNumber2);
      this.approvalTypeNumber3_.next(this.approvalTypeNumber3);
      this.approvalTypeNumber4_.next(this.approvalTypeNumber4);
    }
  }

  /**
   * Subscribes to all date segments and propagates value as `string`.
   * @returns Subscription
   */
  subscribeAndPropagateChanges() {
    const dateFields: Segments = {
      approvalTypeNumber1: this.approvalTypeNumber1$,
      approvalTypeNumber2: this.approvalTypeNumber2$,
      approvalTypeNumber3: this.approvalTypeNumber3$,
      approvalTypeNumber4: this.approvalTypeNumber4$
    };
    return combineLatest(dateFields).subscribe({
      next: ({ approvalTypeNumber1, approvalTypeNumber2, approvalTypeNumber3, approvalTypeNumber4 }) => {
        if (!approvalTypeNumber1 && !approvalTypeNumber2 && !approvalTypeNumber3 && !approvalTypeNumber4) {
          this.onChange(null);
          return;
        }
        this.onChange(this.processApprovalTypeNumber(approvalTypeNumber1, approvalTypeNumber2, approvalTypeNumber3, approvalTypeNumber4));
      }
    });
  }

  clearInput() {
    this.approvalTypeNumber1 = '';
    this.approvalTypeNumber2 = '';
    this.approvalTypeNumber3 = '';
    this.approvalTypeNumber4 = '';
    this.onChange(null);
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get editTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  processApprovalTypeNumber(
    techRecord_approvalTypeNumber1: any,
    techRecord_approvalTypeNumber2: any,
    techRecord_approvalTypeNumber3: any,
    techRecord_approvalTypeNumber4: any
  ) {
    switch (this.approvalType) {
      case 'NTA':
        return techRecord_approvalTypeNumber1;

      case 'ECTA':
        return `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`;

      case 'IVA':
        return techRecord_approvalTypeNumber1;

      case 'NSSTA':
        return `e${techRecord_approvalTypeNumber1}*NKS*${techRecord_approvalTypeNumber2}`;

      case 'ECSSTA':
        return `e${techRecord_approvalTypeNumber1}*KS${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`;

      case 'GB WVTA':
        return `${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`;

      case 'UKNI WVTA':
        return `X11*${techRecord_approvalTypeNumber1}/${techRecord_approvalTypeNumber2}*${techRecord_approvalTypeNumber3}`;

      case 'EU WVTA Pre 23':
        return `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`;

      case 'EU WVTA 23 on':
        return `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`;

      case 'QNIG':
        return `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`;

      case 'Prov.GB WVTA':
        return `${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`;

      case 'Small series':
        return `X11*NKS*${techRecord_approvalTypeNumber1}${techRecord_approvalTypeNumber2}`;

      case 'IVA - VCA':
        return `n11*NIV${techRecord_approvalTypeNumber1}/${techRecord_approvalTypeNumber2}*${techRecord_approvalTypeNumber3}`;

      case 'IVA - DVSA/NI':
        return techRecord_approvalTypeNumber1;
      default:
        return 'Unknown approval type';
    }
  }
}
