import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import accessibleAutocomplete, { enhanceSelectElement } from 'accessible-autocomplete/dist/accessible-autocomplete.min';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AutocompleteComponent,
      multi: true
    }
  ]
})
export class AutocompleteComponent extends BaseControlComponent implements AfterViewInit {
  @Input() options: any[] = [];
  @Input() defaultValue: string = '';

  constructor(injector: Injector, @Inject(DOCUMENT) private document: Document) {
    super(injector);
  }

  ngAfterViewInit(): void {
    enhanceSelectElement({
      selectElement: this.document.querySelector('#' + this.name),
      autoselect: false
    });
  }
}
