declare module 'accessible-autocomplete/dist/accessible-autocomplete.min' {

  export interface AutocompleteParams {
    element: any,
    id: string,
    source: Array<any>,
    onConfirm: (value: any) => void,
    confirmOnBlur: boolean
    required: true
    defaultValue: string
    enhanceSelectElement?: (params: any) => void
  }

  export interface AutocompleteEnhanceParams {
    selectElement: any,
    autoselect: boolean
  }

  export default function accesibleAutocomplete(params: AutocompleteParams): void;
  export function enhanceSelectElement(params: AutocompleteEnhanceParams): void;
}
