interface DISAtom<Str> {
  name: string;
  description?: Str;
}

interface DISConcept<Str> {
  name: string;
  description?: Str;
  latticeOfConcepts: string[];
}

interface DISVirtualConcept<Str> {
  name: string;
  description?: Str;
}

interface DISGraph<Str> {
  name: string;
  description?: Str;
  rootedAt?: string;
}

interface DISEdge<Str> {
  from: string;
  to: string;
  predicate?: Str;
  relation: string;
}

/**
 * Type definitions for DISCore.
 * Noticed that this namespace is used for setting types.
 * So the actucal string type is set to be string or null.
 * When setting an attribute to be null, it means that the attribute should be removed.
 * And when setting an attribute to be undefined or not setting totally, it means that the attribute should not be changed.
 */
namespace DISSetType {
  type Str = string | null;
  export type Atom = DISAtom<Str>;
  export type Concept = DISConcept<Str>;
  export type VirtualConcept = DISVirtualConcept<Str>;
  export type Graph = DISGraph<Str>;
  export type Edge = DISEdge<Str>;
}

/**
 * Type definitions for DISCore.
 * Noticed that this namespace is used for getting types.
 * So not same as DISSetType, there is no null type in the actual string type.
 */
namespace DISGetType {
  type Str = string;
  export type Atom = DISAtom<Str>;
  export type Concept = DISConcept<Str>;
  export type VirtualConcept = DISVirtualConcept<Str>;
  export type Graph = DISGraph<Str>;
  export type Edge = DISEdge<Str>;
}

export { DISGetType, DISSetType };
