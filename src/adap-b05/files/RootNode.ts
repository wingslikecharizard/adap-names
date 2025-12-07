// RootNode.ts

import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { Node } from "./Node";                       
import { Exception } from "../common/Exception";     
import { ServiceFailureException } from "../common/ServiceFailureException";
import { AssertionDispatcher } from "../common/AssertionDispatcher";         
import { ExceptionType } from "../common/ExceptionType";    

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }

    protected assertIsValidBaseName(bn: string, type: ExceptionType): void {
        const violated = (bn === null || bn === undefined);

        AssertionDispatcher.dispatch(
            type,
            violated,
            "invalid basename for root"
        );
    }

    protected assertInvariant(): void {
        AssertionDispatcher.dispatch(
            ExceptionType.INVARIANT,
            this.parentNode !== this,
            "root node must be its own parent"
        );
    }

}