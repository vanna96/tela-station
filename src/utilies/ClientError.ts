

abstract class ClientRequestError {
    abstract message: string;

    abstract setMessage(message: string): void;
    abstract getMessage(): string;
}


export class UpdateDataSuccess extends ClientRequestError {
    message: string = '';

    constructor(message : string) {
        super();

        this.message = message;
    }

    setMessage(message: string): void {
        throw new Error("Method not implemented.");
    }


    getMessage(): string {
        throw new Error("Method not implemented.");
    }

}