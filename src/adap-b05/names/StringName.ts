import { DEFAULT_DELIMITER } from "../common/Printable";
import { ExceptionType } from "../common/ExceptionType";
import { AssertionDispatcher } from "../common/AssertionDispatcher";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.name = source;
    }

    public getNoComponents(): number {
        this.assertInvariant();

        const result = this.getNoComponentsInternal();

        this.assertInvariant();
        return result;
    }

    public getComponent(i: number): string {
        this.assertInvariant();
        this.assertValidIndex(i, false, ExceptionType.PRECONDITION);

        const value = this.getComponentInternal(i);

        this.assertIsValidNamePart(value, ExceptionType.POSTCONDITION);
        this.assertInvariant();

        return value;
    }

    public setComponent(i: number, c: string): void {
        this.assertInvariant();
        this.assertValidIndex(i, false, ExceptionType.PRECONDITION);
        this.assertIsValidNamePart(c, ExceptionType.PRECONDITION);

        const parts = this.name === "" ? [""] : this.name.split(this.delimiter);
        parts[i] = c;
        this.name = parts.join(this.delimiter);

        this.assertIsValidNamePart(this.getComponentInternal(i), ExceptionType.POSTCONDITION);
        this.assertInvariant();
    }

    public insert(i: number, c: string): void {
        this.assertInvariant();
        this.assertValidIndex(i, true, ExceptionType.PRECONDITION);
        this.assertIsValidNamePart(c, ExceptionType.PRECONDITION);

        const parts = this.name === "" ? [""] : this.name.split(this.delimiter);
        parts.splice(i, 0, c);
        this.name = parts.join(this.delimiter);

        this.assertIsValidNamePart(this.getComponentInternal(i), ExceptionType.POSTCONDITION);
        this.assertInvariant();
    }

    public append(c: string): void {
        const end = this.getNoComponentsInternal();
        this.insert(end, c);
    }

    public remove(i: number): void {
        this.assertInvariant();
        this.assertValidIndex(i, false, ExceptionType.PRECONDITION);

        const parts = this.name === "" ? [""] : this.name.split(this.delimiter);
        parts.splice(i, 1);
        this.name = parts.length === 0 ? "" : parts.join(this.delimiter);

        this.assertInvariant();
    }

    public clone(): Name {
        this.assertInvariant();
        const result = new StringName(this.name, this.delimiter);
        this.assertInvariant();
        return result;
    }

    protected getNoComponentsInternal(): number {
        if (this.name.length === 0) return 1;
        return this.name.split(this.delimiter).length;
    }

    protected getComponentInternal(i: number): string {
        if (this.name === "") {
            return "";
        }
        
        const parts = this.name.split(this.delimiter);
        return parts[i];
    }
}
