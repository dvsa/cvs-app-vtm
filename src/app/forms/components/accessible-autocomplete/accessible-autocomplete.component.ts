import { DOCUMENT } from '@angular/common';
import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import accessibleAutocomplete from 'accessible-autocomplete/dist/accessible-autocomplete.min';
import { BaseControlComponent } from '../base-control/base-control.component';



@Component({
  selector: 'app-accessible-autocomplete',
  templateUrl: './accessible-autocomplete.component.html',
  styleUrls: ['./accessible-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AccessibleAutocompleteComponent,
      multi: true
    }
  ]
})
export class AccessibleAutocompleteComponent extends BaseControlComponent implements OnInit {
  @Input() options: String[] = [];

  constructor(injector: Injector, @Inject(DOCUMENT) private document: Document) {
    super(injector)
  }

  ngOnInit(): void {
    this.name = this.name || 'accessible-autocomplete';
    accessibleAutocomplete({
      element: this.document.querySelector('#' + this.name + '-wrapper'),
      id: `${ this.name }-autocomplete`, //this matches the relevant label
      source: this.options, //this needs an array of values to have in the search box otherwise you'll get no results found
      onConfirm: (value)=>this.onChange(value),
      confirmOnBlur: false,
      required: true
    });

  }
}