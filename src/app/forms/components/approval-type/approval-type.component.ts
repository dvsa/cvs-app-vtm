import { AfterContentInit, ChangeDetectorRef, Component, Injector, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { techRecord } from '@store/technical-records';

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
export class ApprovalTypeInputComponent extends BaseControlComponent implements OnChanges, OnInit, OnDestroy, AfterContentInit {
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
      }
    });
  }

  ngOnChanges(): void {
    this.valueWriteBack(this.value);
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
    const patterns: Record<string, RegExp> = {
      NTA: /(\d+)/,
      ECTA: /e(\d+)\*(\d+)\/(\d+)\*(\d+)/,
      IVA: /(\d+)/,
      NSSTA: /e(\d+)\*NKS(\d+)/,
      ECSSTA: /e(\d+)\*KS(\d+)\/(\d+)\*(\d+)/,
      'GB WVTA': /(\d+)\/(\d+)\*(\d+)/,
      'UKNI WVTA': /X11(\d+)\/(\d+)\*(\d+)/,
      'EU WVTA Pre 23': /e(\d+)\*(\d+)\/(\d+)\*(\d+)/,
      'EU WVTA 23 on': /e(\d+)\*(\d+)\/(\d+)\*(\d+)/,
      QNIG: /e(\d+)\*(\d+)\/(\d+)\*(\d+)/,
      'Prov.GB WVTA': /(\d+)\/(\d+)\*(\d+)/,
      'Small series': /X11NKS(\d+)/,
      'IVA - VCA': /n11NIV(\d+)\/(\d+)\*(\d+)/,
      'IVA - DVSA/NI': /(\d+)/
    };

    if (value && this.approvalType && patterns[this.approvalType]) {
      const pattern = patterns[this.approvalType];
      const matches = value.match(pattern);

      if (matches) {
        const [, techRecord_approvalTypeNumber1, techRecord_approvalTypeNumber2, techRecord_approvalTypeNumber3, techRecord_approvalTypeNumber4] =
          matches;
        this.approvalTypeNumber1 = techRecord_approvalTypeNumber1;
        this.approvalTypeNumber1_.next(techRecord_approvalTypeNumber1);
        this.approvalTypeNumber2 = techRecord_approvalTypeNumber2;
        this.approvalTypeNumber2_.next(techRecord_approvalTypeNumber2);
        this.approvalTypeNumber3 = techRecord_approvalTypeNumber3;
        this.approvalTypeNumber3_.next(techRecord_approvalTypeNumber3);
        this.approvalTypeNumber4 = techRecord_approvalTypeNumber4;
        this.approvalTypeNumber4_.next(techRecord_approvalTypeNumber4);
      }
    }
  }

  /**
   * Subscribes to all date segments and propagates value as `string`.
   * @returns Subscription
   */
  subscribeAndPropagateChanges() {
    const approvalNumberFields: Segments = {
      approvalTypeNumber1: this.approvalTypeNumber1$,
      approvalTypeNumber2: this.approvalTypeNumber2$,
      approvalTypeNumber3: this.approvalTypeNumber3$,
      approvalTypeNumber4: this.approvalTypeNumber4$
    };
    return combineLatest(approvalNumberFields).subscribe({
      next: ({ approvalTypeNumber1, approvalTypeNumber2, approvalTypeNumber3, approvalTypeNumber4 }) => {
        if (!approvalTypeNumber1 && !approvalTypeNumber2 && !approvalTypeNumber3 && !approvalTypeNumber4) {
          this.onChange(null);
          return;
        }
        this.onChange(this.processApprovalTypeNumber(approvalTypeNumber1, approvalTypeNumber2, approvalTypeNumber3, approvalTypeNumber4));
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
      case 'ECTA':
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
        return techRecord_approvalTypeNumber1 ? techRecord_approvalTypeNumber1 : null;

      case 'ECTA':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3 && techRecord_approvalTypeNumber4
          ? `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`
          : null;

      case 'IVA':
        return techRecord_approvalTypeNumber1 ? techRecord_approvalTypeNumber1 : null;

      case 'NSSTA':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2
          ? `e${techRecord_approvalTypeNumber1}*NKS*${techRecord_approvalTypeNumber2}`
          : null;

      case 'ECSSTA':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3 && techRecord_approvalTypeNumber4
          ? `e${techRecord_approvalTypeNumber1}*KS${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`
          : null;

      case 'GB WVTA':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3 && techRecord_approvalTypeNumber4
          ? `${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`
          : null;

      case 'UKNI WVTA':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3
          ? `X11*${techRecord_approvalTypeNumber1}/${techRecord_approvalTypeNumber2}*${techRecord_approvalTypeNumber3}`
          : null;

      case 'EU WVTA Pre 23':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3 && techRecord_approvalTypeNumber4
          ? `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`
          : null;

      case 'EU WVTA 23 on':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3 && techRecord_approvalTypeNumber4
          ? `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`
          : null;

      case 'QNIG':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3 && techRecord_approvalTypeNumber4
          ? `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`
          : null;

      case 'Prov.GB WVTA':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3 && techRecord_approvalTypeNumber4
          ? `${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`
          : null;

      case 'Small series':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2
          ? `X11*NKS*${techRecord_approvalTypeNumber1}${techRecord_approvalTypeNumber2}`
          : null;

      case 'IVA - VCA':
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3
          ? `n11*NIV${techRecord_approvalTypeNumber1}/${techRecord_approvalTypeNumber2}*${techRecord_approvalTypeNumber3}`
          : null;

      case 'IVA - DVSA/NI':
        return techRecord_approvalTypeNumber1 ? techRecord_approvalTypeNumber1 : null;
      default:
        return 'Unknown approval type';
    }
  }

  getId(name: string) {
    const id = name + '-day';
    if (this.control) {
      this.control.meta.customId = id;
    }
    return id;
  }
}
