// File.ts 

import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { AssertionDispatcher } from "../common/AssertionDispatcher";
import { ExceptionType } from "../common/ExceptionType";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
        this.assertInvariant();
    }

    public open(): void {
        this.assertStateIsNot(FileState.DELETED, ExceptionType.PRECONDITION, "open() can't open a file in State DELETED");
        this.state = FileState.OPEN;
        this.assertStateIs(FileState.OPEN, ExceptionType.POSTCONDITION, "file is not in state OPENED after open()");
        this.assertInvariant();
    }

    public read(noBytes: number): Int8Array {
        this.assertValidNoBytes(
            noBytes,
            ExceptionType.PRECONDITION
        );
        this.assertReadableState(
            ExceptionType.PRECONDITION
        );

        const result: Int8Array = new Int8Array(noBytes);
        let tries: number = 0;

        for (let i = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch (ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                }
            }
        }

        this.assertReadResultLength(
            result,
            noBytes,
            ExceptionType.POSTCONDITION
        );

        this.assertInvariant();
        return result;
    }

    public close(): void {
        this.assertStateIs(
            FileState.OPEN,
            ExceptionType.PRECONDITION,
            "cannot close a file that is not OPEN"
        );

        this.state = FileState.CLOSED;

        this.assertStateIs(
            FileState.CLOSED,
            ExceptionType.POSTCONDITION,
            "file is not in state CLOSED after close()"
        );

        this.assertInvariant();
    }

    protected readNextByte(): number {
        return 0;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    // Assertions 

    protected assertInvariant(): void {
        super.assertInvariant();
        this.assertIsValidState();
    }

    protected assertStateIs(expected: FileState, type: ExceptionType, message: string): void {
        AssertionDispatcher.dispatch(
            type,
            this.state !== expected,
            message
        );
    }

    protected assertStateIsNot(forbidden: FileState, type: ExceptionType, message: string): void {
    AssertionDispatcher.dispatch(
        type,
        this.state === forbidden, 
        message
    );  
    }

    protected assertIsValidState() {

        const validStates = [
            FileState.OPEN,
            FileState.CLOSED,
            FileState.DELETED
        ];

        AssertionDispatcher.dispatch(
            ExceptionType.INVARIANT,
            !validStates.includes(this.state),
            "invalid file state"
        );
    }

    protected assertValidNoBytes(noBytes: number, type: ExceptionType): void {
        AssertionDispatcher.dispatch(
            type,
            noBytes < 0,
            "noBytes must be >= 0"
        );
    }

    protected assertReadableState(type: ExceptionType): void {
        this.assertStateIs(
            FileState.OPEN,
            type,
            "file must be OPEN to read()"
        );

        this.assertStateIsNot(
            FileState.DELETED,
            type,
            "file is deleted"
        );
    }

    protected assertReadResultLength(result: Int8Array, expected: number, type: ExceptionType): void {
        AssertionDispatcher.dispatch(
            type,
            result.length !== expected,
            "read() returned wrong number of bytes"
        );
    }
}
