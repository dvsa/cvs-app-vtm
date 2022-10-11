export interface MultiOption {
  label: string;
  value: string | number | boolean;
}
export interface MultiOptions extends Array<MultiOption> {}
