// test/adap-b06/names/EqualityContract.test.ts

import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";
import { MethodFailedException } from "../../../src/adap-b06/common/MethodFailedException";
import { InvalidStateException } from "../../../src/adap-b06/common/InvalidStateException";

type NameFactory = {
  label: string;
  fromComponents(components: string[]): Name;
  fromString(text: string): Name;
};

const factories: NameFactory[] = [
  {
    label: "StringName",
    fromComponents: (components) => new StringName(components.join(".")),
    fromString: (text) => new StringName(text),
  },
  {
    label: "StringArrayName",
    fromComponents: (components) => new StringArrayName(components),
    fromString: (text) =>
      text.length === 0 ? new StringArrayName([""]) : new StringArrayName(text.split(".")),
  },
];

// Testing attributes of equality contract 

factories.forEach(({ label, fromComponents, fromString }) => {
  describe(`Equality contract for ${label}`, () => {

    it("is reflexive", () => {
      const n = fromString("a.b");
      expect(n.isEqual(n)).toBe(true);                
    });

    it("is symmetric for equal values", () => {
      const a = fromComponents(["a", "b"]);
      const b = fromComponents(["a", "b"]);

      const ab = a.isEqual(b);
      const ba = b.isEqual(a);

      expect(ab).toBe(true);                          
      expect(ba).toBe(true);                          
      expect(ab).toBe(ba);                            
    });

    it("is symmetric for unequal values", () => {
      const a = fromComponents(["a", "b"]);
      const b = fromComponents(["x", "y"]);

      const ab = a.isEqual(b);
      const ba = b.isEqual(a);

      expect(ab).toBe(false);
      expect(ba).toBe(false);
      expect(ab).toBe(ba);                            
    });

    it("is transitive", () => {
      const a = fromComponents(["a", "b"]);
      const b = fromComponents(["a", "b"]);
      const c = fromComponents(["a", "b"]);

      expect(a.isEqual(b)).toBe(true);                
      expect(b.isEqual(c)).toBe(true);                
      expect(a.isEqual(c)).toBe(true);                
    });

    it("is consistent for equal objects", () => {
      const a = fromComponents(["a", "b"]);
      const b = fromComponents(["a", "b"]);

      const first = a.isEqual(b);

      for (let i = 0; i < 10; i++) {
        expect(a.isEqual(b)).toBe(first);
      }                                               
    });

    it("is consistent for unequal objects", () => {
      const a = fromComponents(["a", "b"]);
      const b = fromComponents(["x", "y"]);

      const first = a.isEqual(b);

      for (let i = 0; i < 10; i++) {
        expect(a.isEqual(b)).toBe(first);
      }                                               
    });

    it("Null-Object precondition: isEqual requires non-null other", () => {
      const a = fromComponents(["a", "b"]);

      expect(() => (a as any).isEqual(null)).toThrow(IllegalArgumentException);            
      expect(() => (a as any).isEqual(undefined)).toThrow(IllegalArgumentException);
    });
  });
});


describe("Equality across Name implementations", () => {
  it("StringName and StringArrayName compare equal for same logical name", () => {
    const n1: Name = new StringName("a.b");
    const n2: Name = new StringArrayName(["a", "b"]);

    expect(n1.isEqual(n2)).toBe(true);
    expect(n2.isEqual(n1)).toBe(true);
  });

  it("StringName and StringArrayName compare unequal for different logical name", () => {
    const n1: Name = new StringName("a.b");
    const n2: Name = new StringArrayName(["x", "y"]);

    expect(n1.isEqual(n2)).toBe(false);
    expect(n2.isEqual(n1)).toBe(false);
  });
});

// Test mutation methods

factories.forEach(({ label, fromComponents }) => {
  describe(`Value semantics for mutating operations (${label})`, () => {

    it("setComponent returns new instance and does not mutate original", () => {
      const n1 = fromComponents(["a", "b"]);
      const n2 = n1.setComponent(1, "x");

      expect(n1.getNoComponents()).toBe(2);
      expect(n1.getComponent(0)).toBe("a");
      expect(n1.getComponent(1)).toBe("b");

      expect(n2.getNoComponents()).toBe(2);
      expect(n2.getComponent(0)).toBe("a");
      expect(n2.getComponent(1)).toBe("x");

      expect(n1.isEqual(n2)).toBe(false);
    });

    it("insert returns new instance and does not mutate original", () => {
      const n1 = fromComponents(["a", "c"]);
      const n2 = n1.insert(1, "b");

      expect(n1.getNoComponents()).toBe(2);
      expect(n1.getComponent(0)).toBe("a");
      expect(n1.getComponent(1)).toBe("c");

      expect(n2.getNoComponents()).toBe(3);
      expect(n2.getComponent(0)).toBe("a");
      expect(n2.getComponent(1)).toBe("b");
      expect(n2.getComponent(2)).toBe("c");
    });

    it("append returns new instance and does not mutate original", () => {
      const n1 = fromComponents(["a"]);
      const n2 = n1.append("b");

      expect(n1.getNoComponents()).toBe(1);
      expect(n1.getComponent(0)).toBe("a");

      expect(n2.getNoComponents()).toBe(2);
      expect(n2.getComponent(0)).toBe("a");
      expect(n2.getComponent(1)).toBe("b");
    });

    it("remove returns new instance and does not mutate original", () => {
      const n1 = fromComponents(["a", "b", "c"]);
      const n2 = n1.remove(1);

      expect(n1.getNoComponents()).toBe(3);
      expect(n1.getComponent(0)).toBe("a");
      expect(n1.getComponent(1)).toBe("b");
      expect(n1.getComponent(2)).toBe("c");

      expect(n2.getNoComponents()).toBe(2);
      expect(n2.getComponent(0)).toBe("a");
      expect(n2.getComponent(1)).toBe("c");
    });

    it("concat returns new instance and does not mutate operands", () => {
      const n1 = fromComponents(["a"]);
      const n2 = fromComponents(["b"]);
      const n3 = n1.concat(n2);

      expect(n1.getNoComponents()).toBe(1);
      expect(n1.getComponent(0)).toBe("a");

      expect(n2.getNoComponents()).toBe(1);
      expect(n2.getComponent(0)).toBe("b");

      expect(n3.getNoComponents()).toBe(2);
      expect(n3.getComponent(0)).toBe("a");
      expect(n3.getComponent(1)).toBe("b");
    });

    it("operations preserve equality when applied to equal operands", () => {
      const a1 = fromComponents(["x", "y"]);
      const a2 = fromComponents(["x", "y"]);

      const b1 = a1.append("z");
      const b2 = a2.append("z");

      expect(a1.isEqual(a2)).toBe(true);  
      expect(b1.isEqual(b2)).toBe(true);  
    });
  });
});