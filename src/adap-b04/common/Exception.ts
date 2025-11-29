import { InvalidStateException } from "./InvalidStateException";

/**
 * Root class for exceptions in ADAP examples
 */
export abstract class Exception extends Error {

    protected trigger: Exception | null = null;

    constructor(m: string, t?: Exception) {
        super(m);

        if (t != undefined) {
            this.trigger = t;
        }
    }

    public static assert(condition: boolean, message?: string): void {
        if (!condition) {
            throw new (this as any)(message);
        }
    }

    public hasTrigger(): boolean {
        return this.trigger != null;
    }

    public getTrigger(): Exception {
        // @todo check if trigger is null
        return this.trigger as Exception;
    }

}