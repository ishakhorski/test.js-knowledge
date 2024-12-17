const watch = <T extends Object>(
    obj: T,
    getCallback?: (key: string, value: any) => void,
    setCallback?: (key: string, value: any) => void
): T => {
    return new Proxy(obj, {
        get(target: T, key: string, receiver: any) {
            if (typeof getCallback === 'function' && key in target) {
                getCallback(key, Reflect.get(target, key, receiver));
            }

            return Reflect.get(target, key, receiver);
        },
        set(target: T, key: string, newValue: any, receiver: any) {
            if (typeof setCallback === 'function') {
                setCallback(key, newValue);
            }

            return Reflect.set(target, key, newValue, receiver);
        }
    })
}

export default watch
