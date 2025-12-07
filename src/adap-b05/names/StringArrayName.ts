import { DEFAULT_DELIMITER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

import { ExceptionType } from "../common/ExceptionType";
import { AssertionDispatcher } from "../common/AssertionDispatcher";

export class StringArrayName extends AbstractName {

  protected components: string[] = [];

  constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
    super(delimiter);

    AssertionDispatcher.dispatch(
      ExceptionType.PRECONDITION,
      source === null || source === undefined,
      "source array must not be null or undefined"
    );

    for (const part of source) {
      this.assertIsValidNamePart(part, ExceptionType.PRECONDITION);
    }

    this.components = [...source];

    this.assertInvariant();
  }

  public getNoComponents(): number {
      this.assertInvariant();

      const result = this.getNoComponentsInternal();

      this.assertInvariant();
      return result;
  }

  protected getNoComponentsInternal(): number {
    return this.components.length;
  }
  
  public getComponent(i: number): string {
    this.assertValidIndex(i, false, ExceptionType.PRECONDITION);

    const result = this.components[i];

    this.assertIsValidNamePart(result, ExceptionType.POSTCONDITION);

    return result;
  }

    protected getComponentInternal(i: number): string {
    return this.components[i];
  }

  public setComponent(i: number, c: string): void {
    this.assertValidIndex(i, false, ExceptionType.PRECONDITION);
    this.assertIsValidNamePart(c, ExceptionType.PRECONDITION);

    this.components[i] = c;

    this.assertIsValidNamePart(
      this.getComponentInternal(i),
      ExceptionType.POSTCONDITION
    );

    this.assertInvariant();
  }

  public insert(i: number, c: string): void {
    this.assertValidIndex(i, true, ExceptionType.PRECONDITION);

    this.assertIsValidNamePart(c, ExceptionType.PRECONDITION);

    this.components.splice(i, 0, c);

    this.assertIsValidNamePart(
      this.getComponentInternal(i),
      ExceptionType.POSTCONDITION
    );

    this.assertInvariant();
  }

  public append(c: string): void {
    this.assertIsValidNamePart(c, ExceptionType.PRECONDITION);

    this.components.push(c);

    this.assertIsValidNamePart(
      this.getComponentInternal(this.components.length - 1),
      ExceptionType.POSTCONDITION
    );

    this.assertInvariant();
  }

  public remove(i: number): void {
    this.assertValidIndex(i, false, ExceptionType.PRECONDITION);

    this.components.splice(i, 1);

    AssertionDispatcher.dispatch(
      ExceptionType.POSTCONDITION,
      this.getNoComponents() < 0,
      "postcondition violated after remove"
    );

    this.assertInvariant();
  }

  public clone(): Name {
    const copy = new StringArrayName([...this.components], this.delimiter);

    AssertionDispatcher.dispatch(
      ExceptionType.POSTCONDITION,
      !this.isEqual(copy),
      "clone must be equal to original"
    );

    return copy;
  }
}
