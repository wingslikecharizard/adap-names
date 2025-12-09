import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    const original: Name = new StringName("oss.fau.de");
    const n = original.insert(1, "cs");

    expect(original.asString()).toBe("oss.fau.de");       
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("inserts after the empty root component", () => {
    const original = new StringName("");      

    const result = original.insert(1, "a");

    expect(original.asString()).toBe("");

    expect(result.asString()).toBe(".a");
    expect(result.getNoComponents()).toBe(2);
    expect(result.getComponent(0)).toBe("");
    expect(result.getComponent(1)).toBe("a");
  });

  it("test append", () => {
    const original: Name = new StringName("oss.cs.fau");
    const n = original.append("de");

    expect(original.asString()).toBe("oss.cs.fau");      
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove", () => {
    const original: Name = new StringName("oss.cs.fau.de");
    const n = original.remove(0);

    expect(original.asString()).toBe("oss.cs.fau.de");    
    expect(n.asString()).toBe("cs.fau.de");
  });

    it("remove on empty name keeps it empty", () => {
    const original = new StringName("");

    const result = original.remove(0);

    expect(original.asString()).toBe("");

    expect(result.asString()).toBe("");
    expect(result.getNoComponents()).toBe(1); 
  });

});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    const original: Name = new StringArrayName(["oss", "fau", "de"]);
    const n = original.insert(1, "cs");

    expect(original.asString()).toBe("oss.fau.de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test append", () => {
    const original: Name = new StringArrayName(["oss", "cs", "fau"]);
    const n = original.append("de");

    expect(original.asString()).toBe("oss.cs.fau");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove", () => {
    const original: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    const n = original.remove(0);

    expect(original.asString()).toBe("oss.cs.fau.de");
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    const original: Name = new StringName("oss#fau#de", '#');
    const n = original.insert(1, "cs");

    expect(original.asString()).toBe("oss#fau#de");      
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    const original: Name = new StringName("oss.cs.fau.de", '#');
    expect(original.getNoComponents()).toBe(1);
    expect(original.asString()).toBe("oss.cs.fau.de");

    const n = original.append("people");

    expect(original.asString()).toBe("oss.cs.fau.de");      
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
    const n1 = n.setComponent(1, "cs");
    expect(n1.asString()).toBe("oss.cs.de");
  });

  it("throws on out-of-range index", () => {
    const n = new StringArrayName(["oss", "fau", "de"]);

    expect(() => n.setComponent(-1, "cs"))
      .toThrow(IllegalArgumentException);

    expect(() => n.setComponent(3, "cs"))
      .toThrow(IllegalArgumentException);
  });

    it("replaces the single empty component", () => {
    const original = new StringName("");        // name === ""

    const result = original.setComponent(0, "a");

    expect(original.asString()).toBe("");

    expect(result.asString()).toBe("a");
    expect(result.getComponent(0)).toBe("a");
  });
});

describe("StringArrayName – append", () => {
  it("append into empty list", () => {
    const original = new StringArrayName([]);
    const n = original.append("a");

    expect(original.asString()).toBe("");     
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
    const original = new StringArrayName(["a", "b", "c"]);
    const n = original.remove(2);

    expect(original.asString()).toBe("a.b.c");
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
  it("should be an empty string", () => {
    const n = new StringName("");
    expect(n.getComponent(0)).toBe("");

  });
});

describe("StringName - setComponent", () => {
  it("updates a component", () => {
    const original = new StringName("oss.cs.fau");
    const n = original.setComponent(1, "x");

    expect(original.asString()).toBe("oss.cs.fau");
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
    const original = new StringName(" ");
    const n = original.append("a");

    expect(original.asString()).toBe(" ");      
    expect(n.asString()).toBe(" .a");
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
    const original = new StringName("a.b.c");
    const n = original.remove(2);

    expect(original.asString()).toBe("a.b.c");
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
    expect(new StringName("").isEmpty()).toBe(false);
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

    const extended = original.append("people");

    expect(original.asString()).toBe("oss.cs.fau.de");
    expect(copy.asString()).toBe("oss.cs.fau.de");
    expect(extended.asString()).toBe("oss.cs.fau.de.people");
  });
});

describe("StringName – clone", () => {
  it("creates an equal but independent copy", () => {
    const original = new StringName("oss.cs.fau.de");
    const copy = original.clone();

    expect(copy.asString()).toBe(original.asString());
    expect(copy.isEqual(original)).toBe(true);

    expect(copy === original).toBe(false);

    const extended = original.append("people");

    expect(original.asString()).toBe("oss.cs.fau.de");
    expect(copy.asString()).toBe("oss.cs.fau.de");
    expect(extended.asString()).toBe("oss.cs.fau.de.people");
  });
});
