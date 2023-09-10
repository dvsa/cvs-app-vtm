import { AfterContentInit, ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControlDirective, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { BaseControlComponent } from '../base-control/base-control.component';
import { CustomFormGroup, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

type Segments = {
  techRecord_approvalTypeNumber1: Observable<string | undefined>;
  techRecord_approvalTypeNumber2: Observable<string | undefined>;
  techRecord_approvalTypeNumber3: Observable<string | undefined>;
  techRecord_approvalTypeNumber4?: Observable<string | undefined>;
};

@Component({
  selector: './app-approval-type-input',
  templateUrl: './approval-type.component.html',
  styleUrls: ['./approval-type.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ApprovalTypeInput,
      multi: true
    }
  ]
})
export class ApprovalTypeInput extends BaseControlComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() isEditing = false;
  @Input() approvalType?: string;

  public form!: CustomFormGroup;

  private techRecord_approvalTypeNumber1_: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private techRecord_approvalTypeNumber2_: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private techRecord_approvalTypeNumber3_: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private techRecord_approvalTypeNumber4_: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private techRecord_approvalTypeNumber1$: Observable<string | undefined>;
  private techRecord_approvalTypeNumber2$: Observable<string | undefined>;
  private techRecord_approvalTypeNumber3$: Observable<string | undefined>;
  private techRecord_approvalTypeNumber4$: Observable<string | undefined>;
  private subscriptions: Array<Subscription | undefined> = [];
  public errors?: { error: boolean; date?: Date; errors?: { error: boolean; reason: string; index: number }[] };
  protected formSubmitted? = false;

  public techRecord_approvalTypeNumber1?: string;
  public techRecord_approvalTypeNumber2?: string;
  public techRecord_approvalTypeNumber3?: string;
  public techRecord_approvalTypeNumber4?: string;

  constructor(injector: Injector, changeDetectorRef: ChangeDetectorRef, public globalErrorService: GlobalErrorService) {
    super(injector, changeDetectorRef);
    this.techRecord_approvalTypeNumber1$ = this.techRecord_approvalTypeNumber1_.asObservable();
    this.techRecord_approvalTypeNumber2$ = this.techRecord_approvalTypeNumber2_.asObservable();
    this.techRecord_approvalTypeNumber3$ = this.techRecord_approvalTypeNumber3_.asObservable();
    this.techRecord_approvalTypeNumber4$ = this.techRecord_approvalTypeNumber4_.asObservable();
    this.globalErrorService.errors$.subscribe((globalErrors: any) => {
      if (globalErrors.length) {
        this.formSubmitted = true;
      }
    });
  }

  ngOnInit(): void {
    console.log('TESTTTTTTT');
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
    console.log('in onTechRecord_approvalTypeNumber1_Change');
    this.techRecord_approvalTypeNumber1_.next(event);
  }

  onTechRecord_approvalTypeNumber2_Change(event: any) {
    console.log('in onTechRecord_approvalTypeNumber2_Change');
    this.techRecord_approvalTypeNumber2_.next(event);
  }

  onTechRecord_approvalTypeNumber3_Change(event: any) {
    console.log('in onTechRecord_approvalTypeNumber3_Change');
    this.techRecord_approvalTypeNumber3_.next(event);
  }

  onTechRecord_approvalTypeNumber4_Change(event: any) {
    console.log('in onTechRecord_approvalTypeNumber4_Change');
    this.techRecord_approvalTypeNumber4_.next(event);
  }

  valueWriteBack(value: string | null): void {
    console.log('in value write back');
    if (value) {
      console.log('in value write back IF');
      this.techRecord_approvalTypeNumber1_.next(this.techRecord_approvalTypeNumber1);
      this.techRecord_approvalTypeNumber2_.next(this.techRecord_approvalTypeNumber2);
      this.techRecord_approvalTypeNumber3_.next(this.techRecord_approvalTypeNumber3);
      this.techRecord_approvalTypeNumber4_.next(this.techRecord_approvalTypeNumber4);
    }
  }

  /**
   * Subscribes to all date segments and propagates value as `Date`.
   * @returns Subscription
   */
  subscribeAndPropagateChanges() {
    const dateFields: Segments = {
      techRecord_approvalTypeNumber1: this.techRecord_approvalTypeNumber1$,
      techRecord_approvalTypeNumber2: this.techRecord_approvalTypeNumber2$,
      techRecord_approvalTypeNumber3: this.techRecord_approvalTypeNumber3$,
      techRecord_approvalTypeNumber4: this.techRecord_approvalTypeNumber4$
    };
    console.log('subscribing and progating changes');
    return combineLatest(dateFields).subscribe({
      next: ({ techRecord_approvalTypeNumber1, techRecord_approvalTypeNumber2, techRecord_approvalTypeNumber3, techRecord_approvalTypeNumber4 }) => {
        if (
          !techRecord_approvalTypeNumber1 &&
          !techRecord_approvalTypeNumber2 &&
          !techRecord_approvalTypeNumber3 &&
          !techRecord_approvalTypeNumber4
        ) {
          console.log('this on change null event');
          this.onChange(null);
          return;
        }
        this.onChange(
          this.processApprovalTypeNumber(
            techRecord_approvalTypeNumber1,
            techRecord_approvalTypeNumber2,
            techRecord_approvalTypeNumber3,
            techRecord_approvalTypeNumber4
          )
        );
      }
    });
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
    console.log('processing approval type number');
    // console.log(
    //     techRecord_approvalTypeNumber1 ?? 'test',
    //     techRecord_approvalTypeNumber2 ?? '',
    //     techRecord_approvalTypeNumber3 ?? '',
    //     techRecord_approvalTypeNumber4 ?? ''
    // );
    switch (this.approvalType) {
      case 'NTA':
        return techRecord_approvalTypeNumber1;

      case 'ECTA':
        return `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`; // You can update this with the actual logic for 'ECTA'.

      case 'IVA':
        return techRecord_approvalTypeNumber1;

      case 'NSSTA':
        console.log(`e${techRecord_approvalTypeNumber1}*NKS*${techRecord_approvalTypeNumber2}${techRecord_approvalTypeNumber3}`);
        return `e${techRecord_approvalTypeNumber1}*NKS*${techRecord_approvalTypeNumber2}${techRecord_approvalTypeNumber3}`; // You can update this with the actual logic for 'NSSTA'.

      case 'ECSSTA':
        return `e${techRecord_approvalTypeNumber1}*KS${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`; // You can update this with the actual logic for 'ECSSTA'.

      case 'GB WVTA':
        return `${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`; // You can update this with the actual logic for 'GB WVTA'.

      case 'UKNI WVTA':
        return `X11*${techRecord_approvalTypeNumber1}/${techRecord_approvalTypeNumber2}*${techRecord_approvalTypeNumber3}`; // You can update this with the actual logic for 'UKNI WVTA'.

      case 'EU WVTA Pre 23':
        return `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`; // You can update this with the actual logic for 'EU WVTA Pre 23'.

      case 'EU WVTA 23 on':
        return `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`; // You can update this with the actual logic for 'EU WVTA 23 on'.

      case 'QNIG':
        return `e${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`; // You can update this with the actual logic for 'QNIG'.

      case 'Prov.GB WVTA':
        return `${techRecord_approvalTypeNumber1}*${techRecord_approvalTypeNumber2}/${techRecord_approvalTypeNumber3}*${techRecord_approvalTypeNumber4}`; // You can update this with the actual logic for 'Prov.GB WVTA'.

      case 'Small series':
        return `X11*NKS*${techRecord_approvalTypeNumber1}${techRecord_approvalTypeNumber2}`; // You can update this with the actual logic for 'Small series'.

      case 'IVA – VCA':
        return `n11*NIV${techRecord_approvalTypeNumber1}/${techRecord_approvalTypeNumber2}*${techRecord_approvalTypeNumber3}`; // You can update this with the actual logic for 'IVA – VCA'.

      case 'IVA – DVSA/NI':
        return techRecord_approvalTypeNumber1;
      default:
        return 'Unknown approval type';
    }
  }
}
