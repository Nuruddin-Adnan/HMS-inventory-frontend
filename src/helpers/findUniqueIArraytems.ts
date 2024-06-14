export default function findUniqueArrayItems(firstArray: any, secondArray: any) {
    // Convert the second array into a set for faster lookup
    const secondSet = new Set(secondArray);
    
    // Initialize an array to store unique items
    const uniqueItems = [];
    
    // Iterate through the first array
    for (const item of firstArray) {
        // Check if the item is not in the set created from the second array
        if (!secondSet.has(item)) {
            // Add the item to the array of unique items
            uniqueItems.push(item);
        }
    }
    
    return uniqueItems;
}
