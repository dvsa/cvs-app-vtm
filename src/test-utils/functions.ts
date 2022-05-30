export function titleCaseFirstWord(value: string) {
  if (value) {
    return value[0].toUpperCase() + value.substring(1);
  } else {
    return value;
  }
}
