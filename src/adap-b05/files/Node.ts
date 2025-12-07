// Node.ts 

import { Directory } from "./Directory";
import { Name } from "../names/Name";
import { AssertionDispatcher } from "../common/AssertionDispatcher";
import { ExceptionType } from "../common/ExceptionType";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";
import { ExceptionMap } from "../common/ExceptionMap";
import { InvalidStateException } from "../common/InvalidStateException";
import { StringName } from "../names/StringName";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        this.assertNotNull(pn, "parent must not be null", ExceptionType.PRECONDITION);

        this.doSetBaseName(bn);
        this.parentNode = pn;
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.assertNotNull(pn, "parent must not be null", ExceptionType.PRECONDITION);

        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.assertNotNull(to, "target directory must not be null", ExceptionType.PRECONDITION);
        to.assertNoDuplicateSameType(this.getBaseName(), this, ExceptionType.PRECONDITION);

        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;

        AssertionDispatcher.dispatch(
            ExceptionType.POSTCONDITION,
            this.parentNode !== to,
            "move() failed to update parent"
        );

        this.assertInvariant();
    }

    public getFullName(): Name {
        const parentName = this.parentNode.getFullName();
        const delim = parentName.getDelimiterCharacter();   
        const parentStr = parentName.asString();            
        const base = this.getBaseName();

        let full: string;
        if (parentStr === "/" || parentStr === "") {
            full = "/" + base;
        } else {
            full = parentStr + delim + base;
        }

        return new StringName(full, delim);
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        this.parentNode.assertNoDuplicateSameType(bn, this, ExceptionType.PRECONDITION);

        this.doSetBaseName(bn);

        AssertionDispatcher.dispatch(
            ExceptionType.POSTCONDITION,
            this.baseName !== bn,
            "rename() failed"
        );

        this.assertInvariant();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        this.assertInvariant();
        return this.parentNode;
    }

    public findNodes(bn: string): Set<Node> {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        const result = new Set<Node>();

        if (this.getBaseName() === bn) {
            result.add(this);
        }
        
        this.assertInvariant();

        return result;
    }

    // Assertions

    protected assertIsValidBaseName(bn: string, type: ExceptionType): void {
        const violated =
            bn === null || bn === undefined || bn.trim().length === 0;

        AssertionDispatcher.dispatch(
            type,
            violated,
            "invalid basename"
        );
    }

    protected assertNotNull(value: any, msg: string, type: ExceptionType) {
        AssertionDispatcher.dispatch(
            type,
            value === null || value === undefined,
            msg
        );
    }

    protected assertInvariant(): void {
        AssertionDispatcher.dispatch(
            ExceptionType.INVARIANT,
            this.parentNode === null || this.parentNode === undefined,
            "invalid parent node"
        );
        
        const invalid =
            this.baseName === null ||
            this.baseName === undefined ||
            this.baseName.trim().length === 0;

        if (invalid) {
            throw new ServiceFailureException(
                "invalid basename",
                new InvalidStateException("invalid basename")
            );
        }
    }

    protected assertHasNoDuplicate(to: Directory): void {
        AssertionDispatcher.dispatch(
            ExceptionType.PRECONDITION,
            to.hasChildNode(this),
            "target directory already contains this node"
    );
    }
}
