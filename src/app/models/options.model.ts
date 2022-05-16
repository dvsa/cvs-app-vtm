export interface MultiOption {
  label: string;
  value: string;
  hint?: string;
}
export interface MultiOptions extends Array<MultiOption> {}
