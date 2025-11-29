import { ExceptionType } from "./ExceptionType";
import { ExceptionMap } from "./ExceptionMap";

export class AssertionDispatcher {
  static dispatch(type: ExceptionType, violated: boolean, message: string): void {
    if (!violated) return;

    const ExcClass = ExceptionMap[type];
    ExcClass.assert(false, message);
  }
}
