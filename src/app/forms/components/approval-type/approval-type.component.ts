import { AfterContentInit, ChangeDetectorRef, Component, Injector, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { techRecord } from '@store/technical-records';
import { logDOM } from '@storybook/testing-library';
import { string } from 'yargs';

const patterns: Record<string, RegExp> = {
  NTA: /^(\w+)$/i,
  'IVA - DVSA/NI': /^(\w+)$/i,
  IVA: /^(\w+)$/i,
  ECTA: /^e(\w{2})\*(\w{4})\/(\w{4})\*(\w{6})$/i,
  NSSTA: /^e(\w{2})\*NKS\*(\w{6})$/i,
  ECSSTA: /^e(\w{2})\*KS(\w{2})\/(\w{4})\*(\w{6})$/i,
  'GB WVTA': /^(\w{3})\*(\w{4})\/(\w{4})\*(\w{7})$/i,
  'UKNI WVTA': /^(\w+)11\*(\w{4})\/(\w{4})\*(\w{6})$/i,
  'EU WVTA Pre 23': /^e(\w{2})\*(\w{4})\/(\wt{4})\*(\w{6})$/i,
  'EU WVTA 23 on': /^e(\w{2})\*(\w{4})\/(\w{4})\*(\w{6})$/i,
  QNIG: /^e(\w{2})\*(\w{4})\/(\w{4})\*(\w{6})$/i,
  'Prov.GB WVTA': /^(\w{3})\*(\w{4})\/(\w{4})\*(\w{6})$/i,
  'Small series': /^(\w+)11\*NKS(\w+\*)?(\w{6})$/i,
  'IVA - VCA': /^n11\*NIV(\w{2})\/(\w{4})\*(\w{6})$/i
};

const patternsPartial: Record<string, RegExp> = {
  NTA: /^(\w+)$/,
  ECTA: /^(\w{0,2})(\w{0,4})(\w{0,4})(\w{0,6})$/,
  IVA: /^(\w+)$/,
  NSSTA: /^(\w{0,2})(\w{0,6})$/,
  ECSSTA: /^(\w{0,2})(\w{0,2})(\w{0,4})(\w{0,6})$/,
  'GB WVTA': /^(\w{0,3})(\w{0,4})(\w{0,4})(\w{0,7})$/,
  'UKNI WVTA': /^(\w{0,1})(\w{0,4})(\w{0,4})(\w{0,6})$/,
  'EU WVTA Pre 23': /^(\w{0,2})(\w{0,4})(\w{0,4})(\w{0,6})$/,
  'EU WVTA 23 on': /^(\w{0,2})(\w{0,4})(\w{0,4})(\w{0,6})$/,
  QNIG: /^(\w{0,2})(\w{0,4})(\w{0,4})(\w{0,6})$/,
  'Prov.GB WVTA': /^(\w{0,3})(\w{0,4})(\w{0,4})(\w{0,6})$/,
  'Small series': /^(\w)(\w{0,2})(\w{0,6})$/,
  'IVA - VCA': /^(\w{0,2})(\w{0,4})(\w{0,6})$/,
  'IVA - DVSA/NI': /^(\w+)$/
};

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
    if (!value || !this.approvalType) {
      return;
    }

    switch (this.approvalType) {
      case 'NTA':
      case 'IVA':
      case 'IVA - DVSA/NI':
        this.extractValuesNtaIva(value, patterns[this.approvalType]);
        break;
      case 'ECTA':
      case 'NSSTA':
      case 'ECSSTA':
      case 'GB WVTA':
      case 'UKNI WVTA':
      case 'EU WVTA Pre 23':
      case 'EU WVTA 23 on':
      case 'QNIG':
      case 'Prov.GB WVTA':
      case 'Small series':
      case 'IVA - VCA':
        this.extractValues(value);
        break;
      default:
        console.log('Unknown approval type');
    }
  }
  private extractValues(value: string) {
    if (!value || !this.approvalType) {
      return;
    }
    value = value.replace(/[^a-zA-Z0-9]/g, '');
    let matches: string[] = [];
    const regexPattern = patternsPartial[this.approvalType] || /^$/;
    const matchResult = value.length > 16 ? value.substring(0, 16).match(/(\w{1,2})(\w{1,4})(\w{1,4})(\w{1,6})/i) : value.match(regexPattern);
    if (matchResult) {
      const [, ...capturedGroups] = matchResult;
      matches.push(...capturedGroups);
    }
    if (!matches?.length && !(this.approvalType in patternsPartial)) {
      console.error('Unknown approvalType:', this.approvalType);
      return;
    }

    // Filter out null values and set the approval numbers
    this.setTypeApprovalNumbers(matches.filter(x => x !== null));
  }

  private extractValuesNtaIva(value: string, pattern: RegExp) {
    const matches = value.match(pattern)?.map(x => {
      if (x.length > 25) {
        return x.substring(0, 25);
      } else {
        return x;
      }
    });
    this.setTypeApprovalNumbers(matches ?? []);
  }

  private setTypeApprovalNumbers(matches: string[]) {
    if (matches) {
      const [techRecord_approvalTypeNumber1, techRecord_approvalTypeNumber2, techRecord_approvalTypeNumber3, techRecord_approvalTypeNumber4] =
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
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3 && techRecord_approvalTypeNumber4
          ? `${techRecord_approvalTypeNumber1}11*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`
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
        return techRecord_approvalTypeNumber1 && techRecord_approvalTypeNumber2 && techRecord_approvalTypeNumber3
          ? `${techRecord_approvalTypeNumber1}11*NKS${techRecord_approvalTypeNumber2}*${techRecord_approvalTypeNumber3}`
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
