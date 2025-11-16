import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        if (delimiter)
            this.delimiter = delimiter;
        this.noComponents = source.split(this.delimiter).length;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name.split(this.delimiter).join(delimiter);
    }

    public asDataString(): string {
        const esc = ESCAPE_CHARACTER;
        const d = this.delimiter;

        const parts = this.name.split(d);
        const masked = parts.map(c =>
            c
                .replace(/\\/g, esc + esc)
                .replace(new RegExp(`\\${d}`, "g"), esc + d)
        );

        return masked.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getNoComponents(): number {
        const parts = this.name.split(this.delimiter);
        return parts.length;
    }

    public getComponent(x: number): string {
        const parts = this.name.split(this.delimiter);

        if (x < 0 || x >= this.getNoComponents()) {
            throw new Error(`Index ${x} out of bounds.`)
        }

        return parts[x];
    }

    public setComponent(n: number, c: string): void {
        const parts = this.name.split(this.delimiter);

        if (n < 0 || n >= this.getNoComponents()) {
            throw new Error(`Index ${n} out of bounds.`)
        }

        parts[n] = c; 
        this.name = parts.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        const parts = this.name.split(this.delimiter);

        if (n < 0 || n > parts.length) {
            throw new Error(`Index ${n} out of bounds`);
        }

        parts.splice(n, 0, c);
        this.name = parts.join(this.delimiter);
    }

    public append(c: string): void {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name = this.name + this.delimiter + c;
        }
    }

    public remove(n: number): void {
        const parts = this.name.split(this.delimiter);

        if (n < 0 || n >= parts.length) {
            throw new Error(`Index ${n} out of bounds`);
        }

        parts.splice(n, 1);
        this.name = parts.join(this.delimiter);
    }

    public concat(other: Name): void {
        const otherStr = other.asString(this.delimiter);
        if (this.isEmpty()) {
            this.name = otherStr;
        } else {
            this.name = this.name + this.delimiter + otherStr;
        }
    }

}