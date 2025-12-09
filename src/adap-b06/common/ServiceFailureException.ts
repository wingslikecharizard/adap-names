import { Exception } from "./Exception";

/**
 * A ServiceFailureException signals that a service failed to provide its service.
 * ServiceFailureExceptions must be checked for by the client after the service call.
 */
export class ServiceFailureException extends Exception {
    constructor(m: string, t?: Exception) {
        super(m, t);
    }
}
