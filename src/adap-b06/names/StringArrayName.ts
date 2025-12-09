import { DEFAULT_DELIMITER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

import { ExceptionType } from "../common/ExceptionType";
import { AssertionDispatcher } from "../common/AssertionDispatcher";
import { getCipherInfo } from "node:crypto";

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

  public setComponent(i: number, c: string): Name {
    this.assertValidIndex(i, false, ExceptionType.PRECONDITION);
    this.assertIsValidNamePart(c, ExceptionType.PRECONDITION);

    const newComponents = [...this.components]
    newComponents[i] = c;

    const result = new StringArrayName(newComponents, this.delimiter);

    this.assertIsValidNamePart(
      result.getComponentInternal(i),
      ExceptionType.POSTCONDITION
    );

    this.assertInvariant();
    result.assertInvariant();

    return result;
  }

  public insert(i: number, c: string): Name {
    this.assertValidIndex(i, true, ExceptionType.PRECONDITION);

    this.assertIsValidNamePart(c, ExceptionType.PRECONDITION);

    const newComponents = [...this.components];
    const result = new StringArrayName(newComponents, this.delimiter);

    result.components.splice(i, 0, c);

    this.assertIsValidNamePart(
      result.getComponentInternal(i),
      ExceptionType.POSTCONDITION
    );

    this.assertInvariant();
    result.assertInvariant();

    return result 
  }

  public append(c: string): Name {
    this.assertIsValidNamePart(c, ExceptionType.PRECONDITION);

    this.assertInvariant();

    const newComponents = [...this.components, c];

    const result = new StringArrayName(newComponents, this.delimiter);

    this.assertIsValidNamePart(
      result.getComponentInternal(result.getNoComponentsInternal() - 1),
      ExceptionType.POSTCONDITION
    );

    this.assertInvariant();
    result.assertInvariant();

    return result;
  }

  public remove(i: number): Name {
    this.assertValidIndex(i, false, ExceptionType.PRECONDITION);

    this.assertInvariant();

    const newComponents = [...this.components];
    newComponents.splice(i, 1);

    const result = new StringArrayName(newComponents, this.delimiter);

    AssertionDispatcher.dispatch(
      ExceptionType.POSTCONDITION,
      result.getNoComponents() < 0,
      "postcondition violated after remove"
    );

    this.assertInvariant();
    result.assertInvariant();

    return result;
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
