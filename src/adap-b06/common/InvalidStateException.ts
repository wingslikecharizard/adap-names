import { Exception } from "./Exception";

/**
 * An InvalidStateException signals an invalid state of an object.
 * In other words, a class invariant failed.
 */
export class InvalidStateException extends Exception {
    
    constructor(m: string, t?: Exception) {
        super(m, t);
    }
    
}
