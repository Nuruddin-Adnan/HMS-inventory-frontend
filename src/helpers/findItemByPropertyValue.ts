// Function to find an item by property value
export default function findItemByPropertyValue(array: any[], property: any, value: any) {
    return array.find(obj => obj[property] === value);
}