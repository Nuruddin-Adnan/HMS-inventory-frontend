interface GroupByFunction<T> {
    (item: T): string;
}

interface GroupedObject<T> {
    [key: string]: T[];
}

export class GroupByHelper {
    static groupBy<T>(data: T[], getKey: GroupByFunction<T>): GroupedObject<T> {
        return data.reduce((acc: GroupedObject<T>, item: T) => {
            const key = getKey(item);
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {} as GroupedObject<T>);
    }
}