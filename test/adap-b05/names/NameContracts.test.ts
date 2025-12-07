import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { MethodFailedException } from "../../../src/adap-b04/common/MethodFailedException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";

function corruptInternalArray(obj: any, index: number, value: any) {
  obj.components[index] = value;
}
function corruptInternalString(obj: any, value: any) {
  obj.name = value;
}

// PRECONDITION 

describe("Precondition tests – IllegalArgumentException", () => {

  it("StringArrayName: getComponent throws on invalid index", () => {
    const n = new StringArrayName(["a", "b"]);

    expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
    expect(() => n.getComponent(5)).toThrow(IllegalArgumentException);
  });

  it("StringArrayName: insert throws when index invalid", () => {
    const n = new StringArrayName(["x", "y"]);
    expect(() => n.insert(99, "z")).toThrow(IllegalArgumentException);
  });

  it("StringArrayName: setComponent requires valid name part", () => {
    const n = new StringArrayName(["a", "b"]);

    expect(() => n.setComponent(0, "   ")).toThrow(IllegalArgumentException);
    expect(() => n.setComponent(0, "")).toThrow(IllegalArgumentException);
  });

  it("StringName: getComponent fails for invalid index", () => {
    const n = new StringName("a.b");

    expect(() => n.getComponent(99)).toThrow(IllegalArgumentException);
    expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
  });

  it("StringName: setComponent fails for invalid name part", () => {
    const n = new StringName("a.b");
    expect(() => n.setComponent(1, "")).toThrow(IllegalArgumentException);
  });

  it("StringName: insert requires valid name part", () => {
    const n = new StringName("a.b");
    expect(() => n.insert(1, "   ")).toThrow(IllegalArgumentException);
  });

  it("StringName: remove throws for out-of-bounds", () => {
    const n = new StringName("a.b");
    expect(() => n.remove(-1)).toThrow(IllegalArgumentException);
    expect(() => n.remove(2)).toThrow(IllegalArgumentException);
  });
});

// POSTCONDITION

describe("Postcondition tests – MethodFailedException", () => {

  it("StringArrayName: setComponent must preserve valid name parts", () => {
    const n = new StringArrayName(["a", "b"]);

    (n as any).components[1] = "good";

    expect(() => n.setComponent(1, " ")).toThrow(IllegalArgumentException);
  });

  it("StringArrayName: insert must insert valid part", () => {
    const n = new StringArrayName(["a"]);
    expect(() => n.insert(1, "")).toThrow(IllegalArgumentException); 

    n.insert(1, "x");
    (n as any).components[1] = " "; 
    expect(() => n.getComponent(1)).toThrow(MethodFailedException);
  });

  it("StringName: setComponent throws MethodFailedException on invalid result", () => {
    const n = new StringName("a.b");
    n.setComponent(1, "x");
    corruptInternalString(n, "a.   ");

    expect(() => n.getComponent(1)).toThrow(InvalidStateException);
  });
});


describe("Invariant tests – InvalidStateException", () => {

  it("StringArrayName detects corrupted internal state", () => {
    const n = new StringArrayName(["good", "nice", "valid"]);

    corruptInternalArray(n, 1, "   ");

    expect(() => n.getNoComponents()).toThrow(InvalidStateException);
    expect(() => n.asString()).toThrow(InvalidStateException);
  });

  it("StringName detects corrupted internal string", () => {
    const n = new StringName("a.b.c");

    corruptInternalString(n, "a..c");

    expect(() => n.asString()).toThrow(InvalidStateException);
    expect(() => n.getComponent(0)).toThrow(InvalidStateException);
  });

  it("StringName detects delimiter invariant violation", () => {
    const n: any = new StringName("a.b.c");
    n.delimiter = "";

    expect(() => n.getComponent(0)).toThrow(InvalidStateException);
  });
});


describe("concat() tests – Contract behavior", () => {

  it("concat precondition: other must not be null", () => {
    const n = new StringArrayName(["a"]);
    expect(() => n.concat(null as any)).toThrow(IllegalArgumentException);
  });

  it("concat invariant: detects corrupted state after concat", () => {
    const n1 = new StringArrayName(["a"]);
    const n2 = new StringArrayName(["b"]);

    n1.concat(n2);

    corruptInternalArray(n1, 0, " ");

    expect(() => n1.asString()).toThrow(InvalidStateException);
  });

  it("concat postcondition: appended components must be valid", () => {
    const n1 = new StringArrayName(["a"]);
    const n2 = new StringArrayName(["b"]);

    n1.concat(n2);
    expect(n1.asString()).toBe("a.b");
  });
});
