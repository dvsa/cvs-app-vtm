export default function getOptionsFromObject(object: object): object[] {
  return Object.values(object).map((value) => {
      return {value: value, label: value}
  })
}
