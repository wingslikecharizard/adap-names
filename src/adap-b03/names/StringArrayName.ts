import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";


export class StringArrayName extends AbstractName {

  protected components: string[] = [];

  constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
    super(delimiter);
    this.components = [...source];
  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    if (i < 0 || i >= this.components.length) {
      throw new Error(`Index ${i} out of bounds`);
    }
    return this.components[i];
  }

  public setComponent(i: number, c: string): void {
    if (i < 0 || i >= this.components.length) {
      throw new Error(`Index ${i} out of bounds`);
    }
    this.components[i] = c;
  }

  public insert(i: number, c: string): void {
    if (i < 0 || i > this.components.length) {
      throw new Error(`Index ${i} out of bounds`);
    }
    this.components.splice(i, 0, c);
  }

  public append(c: string): void {
    this.components.push(c);
  }

  public remove(i: number): void {
    if (i < 0 || i >= this.components.length) {
      throw new Error(`Index ${i} out of bounds`);
    }
    this.components.splice(i, 1);
  }

  public clone(): Name {
    return new StringArrayName(this.components, this.delimiter);
  }
}