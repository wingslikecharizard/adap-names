// src/adap-b03/names/StringName.ts
import { DEFAULT_DELIMITER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringName extends AbstractName {

  protected name: string = "";

  constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
    super(delimiter);
    this.name = source;
  }

  public getNoComponents(): number {
    if (this.name === "") {
      return 0;
    }
    return this.name.split(this.delimiter).length;
  }

  public getComponent(i: number): string {
    if (this.name === "") {
      throw new Error(`Index ${i} out of bounds.`);
    }
    const parts = this.name.split(this.delimiter);
    if (i < 0 || i >= parts.length) {
      throw new Error(`Index ${i} out of bounds.`);
    }
    return parts[i];
  }

  public setComponent(i: number, c: string): void {
    const parts = this.name === "" ? [] : this.name.split(this.delimiter);
    if (i < 0 || i >= parts.length) {
      throw new Error(`Index ${i} out of bounds.`);
    }
    parts[i] = c;
    this.name = parts.join(this.delimiter);
  }

  public insert(i: number, c: string): void {
    const parts = this.name === "" ? [] : this.name.split(this.delimiter);
    if (i < 0 || i > parts.length) {
      throw new Error(`Index ${i} out of bounds`);
    }
    parts.splice(i, 0, c);
    this.name = parts.join(this.delimiter);
  }

  public append(c: string): void {
    this.insert(this.getNoComponents(), c);
  }

  public remove(i: number): void {
    const parts = this.name === "" ? [] : this.name.split(this.delimiter);
    if (i < 0 || i >= parts.length) {
      throw new Error(`Index ${i} out of bounds`);
    }
    parts.splice(i, 1);
    this.name = parts.join(this.delimiter);
  }

  public clone(): Name {
    return new StringName(this.name, this.delimiter);
  }
}
