import { Pipe, PipeTransform } from '@angular/core';
import { SelectOption } from './../models/select-option';

/**
 *
 * @usageNotes
 *
 * Converts a string to a dev friendly identifiable object
 *
 */
@Pipe({
  name: 'displayOptions'
})
export class DisplayOptionsPipe implements PipeTransform {
  transform(strOptions: string[], selectedOptions: string[] = []): SelectOption[] {
    return strOptions.map((option, index) => {
      return {
        id: index,
        name: option.trim(),
        selected: selectedOptions.includes(option)
      } as SelectOption;
    });
  }
}
