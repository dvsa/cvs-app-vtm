declare module 'accessible-autocomplete/dist/accessible-autocomplete.min' {
  interface ElementParam {
    element: HTMLElement;
  }
  interface EnhancedElementParam {
    selectElement: HTMLElement | null;
  }
  interface DefaultParams {
    id?: string;
    source?: Array<any>;
    onConfirm?: (value: string) => void;
    confirmOnBlur?: boolean;
    required?: true;
    defaultValue?: string;
    autoselect?: boolean;
    showAllValues?: boolean;
    dropdownArrow?: Function;
  }

  export interface AutocompleteParams extends DefaultParams, ElementParam {}
  export interface AutocompleteEnhanceParams extends DefaultParams, EnhancedElementParam {}

  export default function accesibleAutocomplete(params: AutocompleteParams): void;
  export function enhanceSelectElement(params: AutocompleteEnhanceParams): void;
}
