import { ExceptionType } from "./ExceptionType";
import { Exception } from "./Exception";
import { IllegalArgumentException } from "./IllegalArgumentException";
import { MethodFailedException } from "./MethodFailedException";
import { InvalidStateException } from "./InvalidStateException";
import { ServiceFailureException } from "./ServiceFailureException";

export const ExceptionMap: Record<ExceptionType, typeof Exception> = {
  [ExceptionType.PRECONDITION]: IllegalArgumentException,
  [ExceptionType.POSTCONDITION]: MethodFailedException,
  [ExceptionType.INVARIANT]: InvalidStateException,
  [ExceptionType.SERVICEFAILURE]: ServiceFailureException
};
