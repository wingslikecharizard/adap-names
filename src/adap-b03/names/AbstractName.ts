import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public asString(delimiter: string = this.delimiter): string {
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
        parts.push(this.getComponent(i));
        }
        return parts.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const esc = ESCAPE_CHARACTER;
        const d = this.delimiter;

        const masked: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
        const c = this.getComponent(i)
            .replace(/\\/g, esc + esc)             
            .replace(new RegExp(`\\${d}`, "g"), esc + d); 

        masked.push(c);
        }

        return masked.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) {
        return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
        if (this.getComponent(i) !== other.getComponent(i)) {
            return false;
        }
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const s = this.asDataString();
        for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i);
        hash = (hash << 5) - hash + c;
        hash |= 0; 
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
    abstract clone(): Name;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
        this.append(other.getComponent(i));
        }
    }

}