declare module 'accessible-autocomplete/dist/accessible-autocomplete.min' {

  export interface AutocompleteParams {
    element: any,
    id: string,
    source: Array<any>,
    onConfirm: (value: any)=>void,
    confirmOnBlur: boolean
    required: true
  }

  export default function accessibleAutocomplete(params: AutocompleteParams): void;
}
