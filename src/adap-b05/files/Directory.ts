// Directory.ts

import { Node } from "./Node";
import { AssertionDispatcher } from "../common/AssertionDispatcher";
import { ExceptionType } from "../common/ExceptionType";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        this.assertNotNull(cn, "child node must not be null in hasChildNode", ExceptionType.PRECONDITION);
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.assertNotNull(cn, "child node must not be null in addChildNode", ExceptionType.PRECONDITION);
        this.assertNoDuplicate(cn);
        this.assertNoDuplicateSameType(cn.getBaseName(), cn, ExceptionType.PRECONDITION);

        this.childNodes.add(cn);
        this.assertInvariant();
    }

    public removeChildNode(cn: Node): void {
        this.assertNotNull(cn, "child node must not be null in removeChildNode", ExceptionType.PRECONDITION);
        this.childNodes.delete(cn); 
        this.assertInvariant();
    }

    public findNodes(bn: string): Set<Node> {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        const result = super.findNodes(bn);

        for (const child of this.childNodes) {
            const matches = child.findNodes(bn);
            for (const n of matches) {
                result.add(n);
            }
        }

        this.assertInvariant();
        return result;
    }

    public assertNoDuplicateSameType(name: string, node: Node, type: ExceptionType): void {
        const duplicate = Array.from(this.childNodes).some(child =>
            child !== node &&                      
            child.getBaseName() === name &&
            child.constructor === node.constructor
        );

        AssertionDispatcher.dispatch(
            type,
            duplicate,
            "name type combination already exists"
        );
    }

    protected assertNoDuplicate(cn: Node) {
        AssertionDispatcher.dispatch(
            ExceptionType.PRECONDITION,
            this.hasChildNode(cn),
            "child node already contained"
    );
    }

}