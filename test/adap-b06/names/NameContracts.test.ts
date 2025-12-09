import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";
import { MethodFailedException } from "../../../src/adap-b06/common/MethodFailedException";
import { InvalidStateException } from "../../../src/adap-b06/common/InvalidStateException";

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

  it("StringName: getComponent fails for invalid index", () => {
    const n = new StringName("a.b");

    expect(() => n.getComponent(99)).toThrow(IllegalArgumentException);
    expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
  });


  it("StringName: remove throws for out-of-bounds", () => {
    const n = new StringName("a.b");
    expect(() => n.remove(-1)).toThrow(IllegalArgumentException);
    expect(() => n.remove(2)).toThrow(IllegalArgumentException);
  });
});

// POSTCONDITION

describe("Postcondition tests – MethodFailedException", () => {
  it("StringName: setComponent throws no Exception when having an empty component", () => {
    const n1 = new StringName("a.b");
    const n2 = n1.setComponent(1, "x");
    corruptInternalString(n2, "a.   ");

    expect(n2.getComponent(1)).toBe("   ");
  });
});


describe("Invariant tests – InvalidStateException", () => {

  it("StringArrayName detects corrupted internal state", () => {
    const n = new StringArrayName(["good", "nice", "valid"]);

    corruptInternalArray(n, 1, "");

    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("good..valid");
  });

  it("StringName detects corrupted internal string", () => {
    const n = new StringName("a.b.c");

    corruptInternalString(n, "a..c");

    expect(n.asString()).toBe("a..c");
    expect(n.getComponent(0)).toBe("a");
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

  it("concat with empty string", () => {
    const n1 = new StringArrayName(["a"]);
    const n2 = new StringArrayName(["b"]);

    const n3 = n1.concat(n2);

    corruptInternalArray(n3, 0, " ");

    expect(n3.asString()).toBe(" .b");  
  });

  it("concat postcondition: appended components must be valid", () => {
    const n1 = new StringArrayName(["a"]);
    const n2 = new StringArrayName(["b"]);

    const n3 = n1.concat(n2);

    expect(n1.asString()).toBe("a");
    expect(n2.asString()).toBe("b");

    expect(n3.asString()).toBe("a.b");
  });
});
