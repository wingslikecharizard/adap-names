import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("StringArrayName – asDataString", () => {
  it("escapes delimiter and backslashes", () => {
    const n = new StringArrayName(["a.b", "c\\d"]);
    expect(n.asDataString()).toBe("a\\.b.c\\\\d");
  });
});

describe("StringArrayName – getComponent", () => {
  it("returns correct component", () => {
    const n = new StringArrayName(["oss", "cs", "fau"]);
    expect(n.getComponent(1)).toBe("cs");
  });

  it("throws on out-of-bounds", () => {
    const n = new StringArrayName(["a"]);
    expect(() => n.getComponent(5)).toThrow(IllegalArgumentException);
  });
});

describe("StringArrayName – setComponent", () => {
  it("updates a component", () => {
    const n = new StringArrayName(["oss", "fau", "de"]);
    n.setComponent(1, "cs");
    expect(n.asString()).toBe("oss.cs.de");
  });

  it("throws on out-of-range index", () => {
    const n = new StringArrayName(["oss", "fau", "de"]);

    expect(() => n.setComponent(-1, "cs"))
      .toThrow(IllegalArgumentException);

    expect(() => n.setComponent(3, "cs"))
      .toThrow(IllegalArgumentException);
  });
});

describe("StringArrayName – append", () => {
  it("append into empty list", () => {
    const n = new StringArrayName([]);
    n.append("a");
    expect(n.asString()).toBe("a");
  });
});

describe("StringArrayName – insert fail cases", () => {
  it("throws on invalid index", () => {
    const n = new StringArrayName(["a", "b"]);
    expect(() => n.insert(10, "x")).toThrow(IllegalArgumentException);
  });
});

describe("StringArrayName – remove", () => {
  it("removes last component", () => {
    const n = new StringArrayName(["a", "b", "c"]);
    n.remove(2);
    expect(n.asString()).toBe("a.b");
  });

  it("throws on invalid index", () => {
    const n = new StringArrayName(["a", "b"]);
    expect(() => n.remove(5)).toThrow(IllegalArgumentException);
  });
});

describe("StringArrayName – getDelimiterCharacter", () => {
  it("returns correct delimiter", () => {
    const n = new StringArrayName(["x"], "#");
    expect(n.getDelimiterCharacter()).toBe("#");
  });
});

describe("StringArrayName – isEmpty", () => {
  it("works for empty and non-empty lists", () => {
    expect(new StringArrayName([]).isEmpty()).toBe(true);
    expect(new StringArrayName(["a"]).isEmpty()).toBe(false);
  });
});

describe("StringName – asDataString", () => {
  it("escapes delimiters inside components", () => {
    const n = new StringName("a.b.c\\d");
    expect(n.asDataString()).toBe("a.b.c\\\\d");
  });
});

describe("StringName – getComponent", () => {
  it("returns correct component", () => {
    const n = new StringName("oss.cs.fau");
    expect(n.getComponent(1)).toBe("cs");
  });

  it("throws on out-of-bounds", () => {
    const n = new StringName("a.b");
    expect(() => n.getComponent(5)).toThrow(IllegalArgumentException);
  });
});

describe("StringName – getComponent on empty name", () => {
  it("throws out-of-bounds error when name is empty", () => {
    const n = new StringName("");

    expect(() => n.getComponent(0))
      .toThrow(IllegalArgumentException);
  });
});

describe("StringName – setComponent", () => {
  it("updates a component", () => {
    const n = new StringName("oss.cs.fau");
    n.setComponent(1, "x");
    expect(n.asString()).toBe("oss.x.fau");
  });

  it("throws an error when index is out of bounds", () => {
    const n = new StringName("oss.cs.fau");

    expect(() => n.setComponent(-1, "x"))
      .toThrow(IllegalArgumentException);

    expect(() => n.setComponent(5, "x"))
      .toThrow(IllegalArgumentException);
  });
});

describe("StringName – append edge cases", () => {
  it("append into previously empty name", () => {
    const n = new StringName("");
    n.append("a");
    expect(n.asString()).toBe("a");
  });
});

describe("StringName – insert fail cases", () => {
  it("throws on invalid index", () => {
    const n = new StringName("a.b.c");
    expect(() => n.insert(10, "x")).toThrow(IllegalArgumentException);
  });
});

describe("StringName – remove", () => {
  it("removes last component", () => {
    const n = new StringName("a.b.c");
    n.remove(2);
    expect(n.asString()).toBe("a.b");
  });

  it("throws on invalid index", () => {
    const n = new StringName("a.b");
    expect(() => n.remove(5)).toThrow(IllegalArgumentException);
  });
});

describe("StringName – getDelimiterCharacter", () => {
  it("returns correct delimiter", () => {
    const n = new StringName("x#y#z", "#");
    expect(n.getDelimiterCharacter()).toBe("#");
  });
});

describe("StringName – isEmpty", () => {
  it("works for empty and non-empty names", () => {
    expect(new StringName("").isEmpty()).toBe(true);
    expect(new StringName("a").isEmpty()).toBe(false);
  });
});

describe("Interchangeability – asDataString()", () => {
  it("produces identical output for StringName and StringArrayName", () => {
    const input = ["ab", "c\\d", "e"];

    const n1 = new StringName(input.join("."));
    const n2 = new StringArrayName(input);

    expect(n1.asDataString()).toBe(n2.asDataString());
  });
});

describe("AbstractName – toString", () => {
  it("delegates to asDataString()", () => {
    const n: Name = new StringArrayName(["a.b", "c\\d", "e"]);

    expect(n.toString()).toBe(n.asDataString());
  });
});

describe("AbstractName – isEqual", () => {
  it("returns true for equal names", () => {
    const n1: Name = new StringName("oss.cs.fau.de");
    const n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);

    expect(n1.isEqual(n2)).toBe(true);
    expect(n2.isEqual(n1)).toBe(true);
  });

  it("returns false for names with different component counts", () => {
    const n1 = new StringName("oss.cs.fau.de");
    const n2 = new StringArrayName(["oss", "cs"]);

    expect(n1.isEqual(n2)).toBe(false);
  });

  it("returns false for different components", () => {
    const n1 = new StringName("oss.cs.fau.de");
    const n2 = new StringArrayName(["oss", "x", "fau", "de"]);

    expect(n1.isEqual(n2)).toBe(false);
  });
});

describe("AbstractName – getHashCode", () => {
  it("returns same hash for equal names", () => {
    const n1 = new StringName("oss.cs.fau.de");
    const n2 = new StringArrayName(["oss", "cs", "fau", "de"]);

    expect(n1.getHashCode()).toBe(n2.getHashCode());
  });

  it("likely returns different hashes for different names", () => {
    const n1 = new StringName("oss.cs.fau.de");
    const n2 = new StringName("oss.cs.fau.com");

    expect(n1.getHashCode()).not.toBe(n2.getHashCode());
  });

  it("is stable across multiple calls", () => {
    const n = new StringName("a.b.c");

    const h1 = n.getHashCode();
    const h2 = n.getHashCode();
    const h3 = n.getHashCode();

    expect(h1).toBe(h2);
    expect(h2).toBe(h3);
  });
});

describe("StringArrayName – clone", () => {
  it("creates an equal but independent copy", () => {
    const original = new StringArrayName(["oss", "cs", "fau", "de"]);
    const copy = original.clone();

    expect(copy.asString()).toBe(original.asString());
    expect(copy.isEqual(original)).toBe(true);

    expect(copy === original).toBe(false);

    original.append("people");
    expect(original.asString()).toBe("oss.cs.fau.de.people");
    expect(copy.asString()).toBe("oss.cs.fau.de");
  });
});

describe("StringName – clone", () => {
  it("creates an equal but independent copy", () => {
    const original = new StringName("oss.cs.fau.de");
    const copy = original.clone();

    expect(copy.asString()).toBe(original.asString());
    expect(copy.isEqual(original)).toBe(true);

    expect(copy === original).toBe(false);

    original.append("people");
    expect(original.asString()).toBe("oss.cs.fau.de.people");
    expect(copy.asString()).toBe("oss.cs.fau.de");
  });
});
