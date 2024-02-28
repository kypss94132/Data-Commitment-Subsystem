type StringOrNull = string | null;

interface DISAtom {
  name: string;
  description?: StringOrNull;
}

interface DISConcept {
  name: string;
  description?: StringOrNull;
  latticeOfConcepts: string[];
}

interface DISVirtualConcept {
  name: string;
  description?: StringOrNull;
}

interface DISGraph {
  name: string;
  description?: StringOrNull;
  rootedAt?: string;
}

interface DISEdge {
  from: string;
  to: string;
  predicate?: StringOrNull;
  relation: string;
}

export { DISAtom, DISConcept, DISVirtualConcept, DISGraph, DISEdge };
