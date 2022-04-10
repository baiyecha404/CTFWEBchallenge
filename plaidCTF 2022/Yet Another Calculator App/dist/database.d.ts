export declare const enqueue: (url: string, ip: string) => Promise<number | false>;
export declare const dequeue: () => Promise<string | undefined>;
