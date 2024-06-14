interface MyObject {
  [key: string]: number | string; // You can adjust the types based on your object structure
}

export function sumArrayField(arr: MyObject[], field: string): number {
  return arr.reduce((accumulator, currentObject) => {
    const fieldValue = currentObject[field];

    // Check if the field value is a number before adding to the accumulator
    if (typeof fieldValue === "number") {
      return accumulator + fieldValue;
    }

    // Ignore non-numeric values
    return accumulator;
  }, 0);
}
