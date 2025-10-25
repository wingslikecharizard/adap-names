import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Basic function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    // Original name string = "oss.cs.fau.de"
    let n: Name = new Name(["oss.cs.fau.de"], '#');
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

// Additional tests

describe("getNoComponents tests", () => {
  it("should return correct number of components initially", () => {
    const n = new Name(["a", "b", "c"]);
    expect(n.getNoComponents()).toBe(3);
  });
});

describe("asDataString tests", () => {
  it("should escape delimiters and escape characters correctly", () => {
    const n = new Name(["fau.cs", "c\\s", "de"]);
    const dataStr = n.asDataString();
    expect(dataStr).toBe("fau\\.cs.c\\\\s.de");
  });

  it("should join components with default delimiter", () => {
    const n = new Name(["a", "b", "c"]);
    expect(n.asDataString()).toBe("a.b.c");
  });
});

describe("Command method tests", () => {
  it("should append components", () => {
    const n = new Name(["a"]);
    n.append("b");
    expect(n.asString()).toBe("a.b");
  });

  it("should remove components", () => {
    const n = new Name(["a", "b", "c"]);
    n.remove(1);
    expect(n.asString()).toBe("a.c");
  });

  it("should set components", () => {
    const n = new Name(["a", "b", "c"]);
    n.setComponent(1, "x");
    expect(n.getComponent(1)).toBe("x");
    expect(n.asString()).toBe("a.x.c");
  });
});

describe("Edge case / error handling tests", () => {
  it("should throw if getComponent out of bounds", () => {
    const n = new Name(["a"]);
    expect(() => n.getComponent(5)).toThrow();
    expect(() => n.getComponent(-1)).toThrow();
  });

  it("should throw if insert out of bounds", () => {
    const n = new Name(["a"]);
    expect(() => n.insert(-1, "x")).toThrow();
    expect(() => n.insert(5, "x")).toThrow();
  });

  it("should throw if remove out of bounds", () => {
    const n = new Name(["a"]);
    expect(() => n.remove(-1)).toThrow();
    expect(() => n.remove(5)).toThrow();
  });

  it("should throw if constructor receives non-array or non-string elements", () => {
    // @ts-ignore
    expect(() => new Name("not an array")).toThrow();
    // @ts-ignore
    expect(() => new Name([1, 2, 3])).toThrow();
  });
});