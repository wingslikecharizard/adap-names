import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

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

// Additional tests for String Array Name

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
    expect(() => n.getComponent(5)).toThrow();
  });
});

describe("StringArrayName – setComponent", () => {
  it("updates a component", () => {
    const n = new StringArrayName(["oss", "fau", "de"]);
    n.setComponent(1, "cs");
    expect(n.asString()).toBe("oss.cs.de");
  });

  it("tries to update component out of range", () => {
    const n = new StringArrayName(["oss", "fau", "de"]);
    
    expect(() => n.setComponent(-1, "cs"))
      .toThrowError("Index -1 out of bounds");

    expect(() => n.setComponent(3, "cs"))
      .toThrowError("Index 3 out of bounds");
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
    expect(() => n.insert(10, "x")).toThrow();
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
    expect(() => n.remove(5)).toThrow();
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

describe("StringArrayName – concat", () => {
  it("concatenates components", () => {
    const n1 = new StringArrayName(["a", "b"]);
    const n2 = new StringArrayName(["c", "d"]);
    n1.concat(n2);
    expect(n1.asString()).toBe("a.b.c.d");
  });
});

// Additional tests for StringName

describe("StringName – asDataString", () => {
  it("escapes only delimiters inside components, not separators", () => {
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
    expect(() => n.getComponent(5)).toThrow();
  });
});

describe("StringName – getComponent on empty name", () => {
  it("throws out-of-bounds error when name is empty", () => {
    const n = new StringName("");

    expect(() => n.getComponent(0))
      .toThrowError("Index 0 out of bounds.");
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
      .toThrowError("Index -1 out of bounds.");

    expect(() => n.setComponent(5, "x"))
      .toThrowError("Index 5 out of bounds.");
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
    expect(() => n.insert(10, "x")).toThrow();
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
    expect(() => n.remove(5)).toThrow();
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

describe("StringName – concat", () => {
  it("concatenates two names", () => {
    const n1 = new StringName("a.b");
    const n2 = new StringName("c.d");
    n1.concat(n2);
    expect(n1.asString()).toBe("a.b.c.d");
  });

  it("concatenating if string is empty beforehand", () => {
    const n1 = new StringName("");
    const n2 = new StringName("fau");
    n1.concat(n2);
    expect(n1.asString()).toBe("fau");
  });
});


// Interchangeable test - asDataString outputs same for StringName and StringArrayName

describe("Interchangeability – asDataString()", () => {
  it("produces identical output for StringName and StringArrayName", () => {
    const input = ["ab", "c\\d", "e"];

    const n1 = new StringName(input.join("."));
    const n2 = new StringArrayName(input);

    const data1 = n1.asDataString();
    const data2 = n2.asDataString();

    expect(data1).toBe(data2);
  });
});


// Additional tests for b03
// AbstractName.ts

describe("AbstractName – toString", () => {
  it("delegates to asDataString()", () => {
    const n: Name = new StringArrayName(["a.b", "c\\d", "e"]);

    const data = n.asDataString();
    const str = n.toString();

    expect(str).toBe(data);
  });
});

describe("AbstractName – isEqual", () => {
  it("returns true for equal names (different implementations)", () => {
    const n1: Name = new StringName("oss.cs.fau.de");
    const n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);

    expect(n1.isEqual(n2)).toBe(true);
    expect(n2.isEqual(n1)).toBe(true);
  });

  it("returns false for names with different number of components", () => {
    const n1: Name = new StringName("oss.cs.fau.de");
    const n2: Name = new StringArrayName(["oss", "cs"]);

    expect(n1.isEqual(n2)).toBe(false);
    expect(n2.isEqual(n1)).toBe(false);
  });

  it("returns false for names with different components", () => {
    const n1: Name = new StringName("oss.cs.fau.de");
    const n2: Name = new StringArrayName(["oss", "x", "fau", "de"]);

    expect(n1.isEqual(n2)).toBe(false);
    expect(n2.isEqual(n1)).toBe(false);
  });
});

describe("AbstractName – getHashCode", () => {
  it("returns the same hash for equal names", () => {
    const n1: Name = new StringName("oss.cs.fau.de");
    const n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);

    const h1 = n1.getHashCode();
    const h2 = n2.getHashCode();

    expect(h1).toBe(h2);
  });

  it("likely returns different hashes for different names", () => {
    const n1: Name = new StringName("oss.cs.fau.de");
    const n2: Name = new StringName("oss.cs.fau.com");

    const h1 = n1.getHashCode();
    const h2 = n2.getHashCode();

    expect(h1).not.toBe(h2);
  });

  it("is stable across multiple calls", () => {
    const n: Name = new StringName("a.b.c");

    const h1 = n.getHashCode();
    const h2 = n.getHashCode();
    const h3 = n.getHashCode();

    expect(h1).toBe(h2);
    expect(h2).toBe(h3);
  });
});

// StringArrayName.ts

describe("StringArrayName – clone", () => {
  it("creates an equal but independent copy", () => {
    const original: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    const copy = original.clone();

    expect(copy.asString()).toBe(original.asString());
    expect(copy.isEqual(original)).toBe(true);

    expect(copy === original).toBe(false);

    original.append("people");
    expect(original.asString()).toBe("oss.cs.fau.de.people");
    expect(copy.asString()).toBe("oss.cs.fau.de");
  });
});

// StringName.ts

describe("StringName – clone", () => {
  it("creates an equal but independent copy", () => {
    const original: Name = new StringName("oss.cs.fau.de");
    const copy = original.clone();

    expect(copy.asString()).toBe(original.asString());
    expect(copy.isEqual(original)).toBe(true);

    expect(copy === original).toBe(false);

    original.append("people");
    expect(original.asString()).toBe("oss.cs.fau.de.people");
    expect(copy.asString()).toBe("oss.cs.fau.de");
  });
});
