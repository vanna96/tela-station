

export default abstract class LocalData<T> {
    abstract key: string;

    abstract get<T>(query? : string): T[];
    abstract find<T>(id? : any, query?: string[]): T;
    abstract delete(id: any): void;
}