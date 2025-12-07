import { Node } from "./Node";
import { Directory } from "./Directory";
import { AssertionDispatcher } from "../common/AssertionDispatcher";
import { ExceptionType } from "../common/ExceptionType";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn !== undefined && tn !== null) {
            this.targetNode = tn;
        }

        this.assertInvariant();
    }

    public getTargetNode(): Node | null {
        this.assertInvariant();
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        AssertionDispatcher.dispatch(
            ExceptionType.PRECONDITION,
            target === null || target === undefined,
            "target node must not be null in setTargetNode"
        );

        this.targetNode = target;

        this.assertInvariant();
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        const target = this.ensureTargetNode(this.targetNode);

        target.rename(bn);
        this.assertInvariant();
    }

    public findNodes(bn: string): Set<Node> {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        this.assertInvariant();

        const result = new Set<Node>();

        if (this.targetNode !== null && this.targetNode !== undefined) {
            const matches = this.targetNode.findNodes(bn);
            for (const n of matches) {
                result.add(n);
            }
        }

        this.assertInvariant();
        return result;
    }

    protected ensureTargetNode(target: Node | null): Node {
        AssertionDispatcher.dispatch(
            ExceptionType.PRECONDITION,
            target === null || target === undefined,
            "link has no target node"
        );

        const result: Node = target as Node;
        return result;
    }

    protected assertInvariant(): void {
        super.assertInvariant();
    }
}
