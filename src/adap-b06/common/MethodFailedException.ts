import { Exception } from "./Exception";

/**
 * A MethodFailedException signals that the method failed to provide its service.
 * In other words, a postcondition failed.
 */
export class MethodFailedException extends Exception {

    constructor(m: string, t?: Exception) {
        super(m, t);
    }
    
}
