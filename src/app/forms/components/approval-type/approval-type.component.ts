import {
  AfterContentInit, ChangeDetectorRef, Component, Injector, Input, OnChanges, OnDestroy, OnInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { FormNodeWidth } from '@forms/services/dynamic-form.types';
import {
  BehaviorSubject, Observable, Subscription, combineLatest,
} from 'rxjs';
import { BaseControlComponent } from '../base-control/base-control.component';

const patterns: Record<string, RegExp> = {
  NTA: /^(.+)$/i, // 25
  'IVA - DVSA/NI': /^(.+)$/i, // 25
  IVA: /^(.+)$/i, // 25
  ECTA: /^e(.{2})\*(.{4})\/(.{4})\*(.{6})$/i, // 20
  NSSTA: /^e(.{2})\*NKS\*(.{6})$/i, // 14
  ECSSTA: /^e(.{2})\*KS(.{2})\/(.{4})\*(.{6})$/i, // 18
  'GB WVTA': /^(.{3})\*(.{4})\/(.{4})\*(.{7})$/i, // 21
  'UKNI WVTA': /^(.{1})11\*(.{4})\/(.{4})\*(.{6})$/i, // 20
  'EU WVTA Pre 23': /^e(.{2})\*(.{4})\/(.{4})\*(.{6})$/i, // 20
  'EU WVTA 23 on': /^e(.{2})\*(.{4})\/(.{4})\*(.{6})$/i, // 20
  QNIG: /^e(.{2})\*(.{4})\/(.{4})\*(.{6})$/i, // 20
  'Prov.GB WVTA': /^(.{3})\*(.{4})\/(.{4})\*(.{6})$/i, // 20
  'Small series': /^(.+)$/i, // 25
  'IVA - VCA': /^n11\*NIV(.{2})\/(.{4})\*(.{6})$/i, // 19
};

const patternsPartialMatch: Record<string, RegExp> = {
  NTA: /^(.+)$/i,
  'IVA - DVSA/NI': /^(.+)$/i,
  IVA: /^(.+)$/i,
  ECTA: /^e(.{0,2})\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
  NSSTA: /^e(.{0,2})\*NKS\*(.{0,6})$/i,
  ECSSTA: /^e(.{0,2})\*KS(.{0,2})\/(.{0,4})\*(.{0,6})$/i,
  'GB WVTA': /^(.{0,3})\*(.{0,4})\/(.{0,4})\*(.{0,7})$/i,
  'UKNI WVTA': /^(.?)11\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
  'EU WVTA Pre 23': /^e(.{0,2})\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
  'EU WVTA 23 on': /^e(.{0,2})\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
  QNIG: /^e(.{0,2})\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
  'Prov.GB WVTA': /^(.{0,3})\*(.{0,4})\/(.{0,4})\*(.{0,6})$/i,
  'Small series': /^(.+)$/i, // 25
  'IVA - VCA': /^n11\*NIV(.{0,2})\/(.{0,4})\*(.{0,6})$/i,
};

const patternsGenericPartialMatch: Record<string, RegExp> = {
  NTA: /^(.+)$/i,
  'IVA - DVSA/NI': /^(.+)$/i,
  IVA: /^(.+)$/i,
  ECTA: /^(.{0,2})(.{0,4})(.{0,4})(.{0,6})$/i,
  NSSTA: /^(.{0,2})(.{0,6})$/i,
  ECSSTA: /^(.{0,2})(.{0,2})(.{0,4})(.{0,6})$/i,
  'GB WVTA': /^(.{0,3})(.{0,4})(.{0,4})(.{0,7})$/i,
  'UKNI WVTA': /^(.?)(.{0,4})(.{0,4})(.{0,6})$/i,
  'EU WVTA Pre 23': /^(.{0,2})(.{0,4})(.{0,4})(.{0,6})$/i,
  'EU WVTA 23 on': /^(.{0,2})(.{0,4})(.{0,4})(.{0,6})$/i,
  QNIG: /^(.{0,2})(.{0,4})(.{0,4})(.{0,6})$/i,
  'Prov.GB WVTA': /^(.{0,3})(.{0,4})(.{0,4})(.{0,6})$/i,
  'Small series': /^(.+)$/i, // 25
  'IVA - VCA': /^(.{0,2})(.{0,4})(.{0,6})$/i,
};

const characterLimit: Record<string, number> = {
  NTA: 25,
  'IVA - DVSA/NI': 25,
  IVA: 25,
  ECTA: 20,
  NSSTA: 14,
  ECSSTA: 18,
  'GB WVTA': 21,
  'UKNI WVTA': 20,
  'EU WVTA Pre 23': 20,
  'EU WVTA 23 on': 20,
  QNIG: 20,
  'Prov.GB WVTA': 20,
  'Small series': 25,
  'IVA - VCA': 19,
};
const characterLimitGeneric: Record<string, number> = {
  NTA: 25,
  'IVA - DVSA/NI': 25,
  IVA: 25,
  ECTA: 16,
  NSSTA: 8,
  ECSSTA: 14,
  'GB WVTA': 18,
  'UKNI WVTA': 15,
  'EU WVTA Pre 23': 16,
  'EU WVTA 23 on': 16,
  QNIG: 16,
  'Prov.GB WVTA': 17,
  'Small series': 25,
  'IVA - VCA': 12,
};

@Component({
  selector: './app-approval-type-input',
  templateUrl: './approval-type.component.html',
  styleUrls: ['./approval-type.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ApprovalTypeInputComponent,
      multi: true,
    },
  ],
})
export class ApprovalTypeInputComponent extends BaseControlComponent implements OnChanges, OnInit, OnDestroy, AfterContentInit {
  @Input() isEditing = false;
  @Input() approvalType?: string;
  @Input() approvalTypeChange: boolean | undefined;

  private approvalTypeNumber_1: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private approvalTypeNumber_2: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private approvalTypeNumber_3: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private approvalTypeNumber_4: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

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
    this.approvalTypeNumber1$ = this.approvalTypeNumber_1.asObservable();
    this.approvalTypeNumber2$ = this.approvalTypeNumber_2.asObservable();
    this.approvalTypeNumber3$ = this.approvalTypeNumber_3.asObservable();
    this.approvalTypeNumber4$ = this.approvalTypeNumber_4.asObservable();
    this.globalErrorService.errors$.subscribe((globalErrors) => {
      if (globalErrors.length) {
        this.formSubmitted = true;
      }
    });
  }

  ngOnChanges(): void {
    this.valueWriteBack(this.value);
    if (this.approvalTypeChange) {
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
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  onTechRecord_approvalTypeNumber1_Change(event: string | undefined) {
    this.approvalTypeNumber_1.next(event);
  }

  onTechRecord_approvalTypeNumber2_Change(event: string | undefined) {
    this.approvalTypeNumber_2.next(event);
  }

  onTechRecord_approvalTypeNumber3_Change(event: string | undefined) {
    this.approvalTypeNumber_3.next(event);
  }

  onTechRecord_approvalTypeNumber4_Change(event: string | undefined) {
    this.approvalTypeNumber_4.next(event);
  }

  valueWriteBack(value: string | null): void {
    if (!value || !this.approvalType) {
      return;
    }
    const NTA_IVA_Types = ['NTA', 'IVA', 'IVA - DVSA/NI', 'Small series'];
    const OtherTypes = ['ECTA', 'NSSTA', 'ECSSTA', 'GB WVTA', 'UKNI WVTA', 'EU WVTA Pre 23', 'EU WVTA 23 on', 'QNIG', 'Prov.GB WVTA', 'IVA - VCA'];

    if (NTA_IVA_Types.includes(this.approvalType)) {
      this.extractValuesNtaIva(value, patterns[this.approvalType]);
    } else if (OtherTypes.includes(this.approvalType)) {
      this.extractValues(value);
    } else {
      console.log('Unknown approval type');
    }
  }

  private extractValues(value: string): void {
    if (!value || !this.approvalType) return;

    const getMatchedValues = (_value: string, pattern: RegExp) => {
      const result = _value.match(pattern);
      return result ? result.slice(1) : [];
    };

    const pattern = patterns[this.approvalType];
    const patternPartial = patternsPartialMatch[this.approvalType] || /^$/;

    let matches = getMatchedValues(value, pattern);
    if (matches) {
      this.setTypeApprovalNumbers(matches.filter((x) => x));
    }

    if (!matches.length) {
      const limit = characterLimit[this.approvalType];
      const limitedValue = value.length > limit ? value.substring(0, limit) : value;
      matches = getMatchedValues(limitedValue, patternPartial);
      this.setTypeApprovalNumbers(matches.filter((x) => x));
    }

    if (!matches.length) {
      const limit = characterLimitGeneric[this.approvalType];
      const limitedValue = value.length > limit ? value.substring(0, limit) : value;
      const genericPattern = patternsGenericPartialMatch[this.approvalType] || /^$/;
      matches = getMatchedValues(limitedValue, genericPattern);
      this.setTypeApprovalNumbers(matches.filter((x) => x));
    }

    if (!matches.length) {
      console.error('Unknown approvalType:', this.approvalType);
    }
  }

  private extractValuesNtaIva(value: string, pattern: RegExp): void {
    const matches = value.match(pattern)?.map((x) => (x.length > 25 ? x.substring(0, 25) : x));
    this.setTypeApprovalNumbers(matches || []);
  }

  private setTypeApprovalNumbers(matches: string[]) {
    if (matches) {
      const [approvalTypeNumber1, approvalTypeNumber2, approvalTypeNumber3, approvalTypeNumber4] = matches;
      this.approvalTypeNumber1 = approvalTypeNumber1;
      this.approvalTypeNumber_1.next(approvalTypeNumber1);
      this.approvalTypeNumber2 = approvalTypeNumber2;
      this.approvalTypeNumber_2.next(approvalTypeNumber2);
      this.approvalTypeNumber3 = approvalTypeNumber3;
      this.approvalTypeNumber_3.next(approvalTypeNumber3);
      this.approvalTypeNumber4 = approvalTypeNumber4;
      this.approvalTypeNumber_4.next(approvalTypeNumber4);
    }
  }

  /**
   * Subscribes to all date segments and propagates value as `string`.
   * @returns Subscription
   */
  subscribeAndPropagateChanges() {
    return combineLatest([this.approvalTypeNumber1$, this.approvalTypeNumber2$, this.approvalTypeNumber3$, this.approvalTypeNumber4$]).subscribe(
      ([approvalTypeNumber1, approvalTypeNumber2, approvalTypeNumber3, approvalTypeNumber4]) => {
        if (!approvalTypeNumber1 && !approvalTypeNumber2 && !approvalTypeNumber3 && !approvalTypeNumber4) {
          this.onChange(null);
        } else {
          this.onChange(this.processApprovalTypeNumber(approvalTypeNumber1, approvalTypeNumber2, approvalTypeNumber3, approvalTypeNumber4));
        }
      },
    );
  }

  validate() {
    const setErrors = () => {
      this.errors = {
        error: true,
        errors: [
          {
            error: true,
            reason: 'Approval type number is required with Approval type',
            index: 0,
          },
        ],
      };
    };

    const oneRequired = () => !this.approvalTypeNumber1 && this.approvalType;
    const twoRequired = () => oneRequired() || !this.approvalTypeNumber2;
    const threeRequired = () => twoRequired() || !this.approvalTypeNumber3;
    const fourRequired = () => threeRequired() || !this.approvalTypeNumber4;

    switch (this.approvalType) {
      case 'NTA':
      case 'IVA':
      case 'IVA - DVSA/NI':
      case 'Small series':
        if (oneRequired()) {
          setErrors();
        }
        break;

      case 'GB WVTA':
      case 'EU WVTA Pre 23':
      case 'EU WVTA 23 on':
      case 'Prov.GB WVTA':
      case 'QNIG':
      case 'ECTA':
      case 'ECSSTA':
      case 'UKNI WVTA':
        if (fourRequired()) {
          setErrors();
        }
        break;

      case 'IVA - VCA':
        if (threeRequired()) {
          setErrors();
        }
        break;

      case 'NSSTA':
        if (twoRequired()) {
          setErrors();
        }
        break;

      default:
        console.log('default');
        break;
    }
  }

  clearInput() {
    this.approvalTypeNumber1 = undefined;
    this.approvalTypeNumber2 = undefined;
    this.approvalTypeNumber3 = undefined;
    this.approvalTypeNumber4 = undefined;

    this.approvalTypeNumber_1.next(this.approvalTypeNumber1);
    this.approvalTypeNumber_2.next(this.approvalTypeNumber2);
    this.approvalTypeNumber_3.next(this.approvalTypeNumber3);
    this.approvalTypeNumber_4.next(this.approvalTypeNumber4);

    this.onChange(null);
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  processApprovalTypeNumber(
    approvalTypeNumber1: string | undefined,
    approvalTypeNumber2: string | undefined,
    approvalTypeNumber3: string | undefined,
    approvalTypeNumber4: string | undefined,
  ) {
    switch (this.approvalType) {
      case 'NTA':
        return approvalTypeNumber1 || null;

      case 'ECTA':
        return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
          ? `e${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
          : null;

      case 'IVA':
        return approvalTypeNumber1 || null;

      case 'NSSTA':
        return approvalTypeNumber1 && approvalTypeNumber2 ? `e${approvalTypeNumber1}*NKS*${approvalTypeNumber2}` : null;

      case 'ECSSTA':
        return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
          ? `e${approvalTypeNumber1}*KS${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
          : null;

      case 'GB WVTA':
        return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
          ? `${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
          : null;

      case 'UKNI WVTA':
        return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
          ? `${approvalTypeNumber1}11*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
          : null;

      case 'EU WVTA Pre 23':
        return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
          ? `e${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
          : null;

      case 'EU WVTA 23 on':
        return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
          ? `e${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
          : null;

      case 'QNIG':
        return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
          ? `e${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
          : null;

      case 'Prov.GB WVTA':
        return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
          ? `${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
          : null;

      case 'Small series':
        return approvalTypeNumber1 || null;

      case 'IVA - VCA':
        return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3
          ? `n11*NIV${approvalTypeNumber1}/${approvalTypeNumber2}*${approvalTypeNumber3}`
          : null;

      case 'IVA - DVSA/NI':
        return approvalTypeNumber1 || null;
      default:
        return 'Unknown approval type';
    }
  }

  getId(name: string) {
    const id = `${name}-approvalTypeNumber1-${this.approvalType}`;
    if (this.control) {
      this.control.meta.customId = id;
    }
    return id;
  }
}
