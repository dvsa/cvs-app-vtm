export default function getOptionsFromObject(object: any): object[] {
  return Object.values(object).map((value) => {
      return {value: value, label: value}
  })
}
