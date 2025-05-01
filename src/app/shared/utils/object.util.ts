export class ObjectUtil {
    public static toMap<T extends {}, TKey extends string | number | symbol>(objs: T[], getKey: (obj: T) => TKey): Record<TKey, T> {
        const result: any = {};
        objs.forEach(o => {
            const k = getKey(o);
            result[k] = o;
        })

        return result;
    }
}