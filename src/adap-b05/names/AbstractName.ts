import { ExceptionType } from "../common/ExceptionType";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

import { AssertionDispatcher } from "../common/AssertionDispatcher";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertInvariant();

        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.getComponent(i)); 
        }

        this.assertInvariant();
        return parts.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        this.assertInvariant();

        const esc = ESCAPE_CHARACTER;
        const d = this.delimiter;

        const masked: string[] = [];
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            const c = this.getComponent(i)
                .replace(/\\/g, esc + esc)
                .replace(new RegExp(`\\${d}`, "g"), esc + d);

            masked.push(c);
        }

        this.assertInvariant();
        return masked.join(d);
    }

    public isEqual(other: Name): boolean {
        AssertionDispatcher.dispatch(
            ExceptionType.PRECONDITION,
            other === null || other === undefined,
            "other must not be null"
        );

        this.assertInvariant();
        const equal =
            this.getNoComponents() === other.getNoComponents() &&
            this.compareComponents(other);

        this.assertInvariant();
        return equal;
    }

    private compareComponents(other: Name): boolean {
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        this.assertInvariant();

        const s = this.asDataString();
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i);
            hash = (hash << 5) - hash + c;
            hash |= 0;
        }

        this.assertInvariant();
        return hash;
    }

    public isEmpty(): boolean {
        this.assertInvariant();
        const result = this.getNoComponents() === 0;
        this.assertInvariant();
        return result;
    }

    public getDelimiterCharacter(): string {
        this.assertInvariant();
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
        AssertionDispatcher.dispatch(
            ExceptionType.PRECONDITION,
            other === null || other === undefined,
            "other must not be null"
        );

        this.assertInvariant();
        for (let i = 0; i < other.getNoComponents(); i++) {
            const p = other.getComponent(i);
            this.append(p);
        }
        this.assertInvariant();
    }

    // getter-function without contract-checking - avoid recursion
    protected abstract getComponentInternal(i: number): string;
    protected abstract getNoComponentsInternal(): number;

    // Contract-functions

    protected assertIsValidNamePart(part: string, type: ExceptionType): void {
        const violated =
            part === null ||
            part === undefined

        AssertionDispatcher.dispatch(type, violated, "invalid name part");
    }

    protected assertValidIndex(i: number, allowEnd: boolean, type: ExceptionType): void {
        const n = this.getNoComponentsInternal();

        const violated = allowEnd
            ? (i < 0 || i > n)
            : (i < 0 || i >= n);

        AssertionDispatcher.dispatch(type, violated, `Index ${i} out of bounds`);
    }

    protected assertInvariant(): void {
        const n = this.getNoComponentsInternal();

        for (let i = 0; i < n; i++) {
            const part = this.getComponentInternal(i);
            this.assertIsValidNamePart(part, ExceptionType.INVARIANT);
        }

        const delInvalid =
            this.delimiter === null ||
            this.delimiter === undefined ||
            this.delimiter.length === 0;

        AssertionDispatcher.dispatch(
            ExceptionType.INVARIANT,
            delInvalid,
            "invalid delimiter invariant"
        );
    }
}
