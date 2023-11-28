declare module 'accessible-autocomplete/dist/accessible-autocomplete.min' {
  interface ElementParam {
    element: any;
  }
  interface EnhancedElementParam {
    selectElement: any;
  }
  interface DefaultParams {
    id?: string;
    source?: Array<any>;
    onConfirm?: (value: any) => void;
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
