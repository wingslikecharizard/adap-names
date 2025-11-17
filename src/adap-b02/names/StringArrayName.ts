import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.components = [...source];
        if (delimiter)
            this.delimiter = delimiter; 
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(this.delimiter);
    }

    public asDataString(): string {
        const esc = ESCAPE_CHARACTER;
        const d = this.getDelimiterCharacter();

        const masked = this.components.map(c =>
            c
                .replace(/\\/g, ESCAPE_CHARACTER + ESCAPE_CHARACTER)             
                .replace(new RegExp(`\\${d}`, "g"), ESCAPE_CHARACTER + d) 
        );

        return masked.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length)
            throw new Error(`Index ${i} out of bounds`);

        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length)
            throw new Error(`Index ${i} out of bounds`);

        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length)
            throw new Error(`Index ${i} out of bounds`);

        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length)
            throw new Error(`Index ${i} out of bounds`);

        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }
}