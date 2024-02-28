import { createContext } from 'react';
import DISOntology from '../main/discore/ontology';

const onto = new DISOntology();
onto.create();
onto.setAtom({
  name: 'a1',
});
onto.setAtom({
  name: 'a2',
});
onto.setAtom({
  name: 'a3',
});
onto.setConcept({
  name: 'c1',
  latticeOfConcepts: ['a1', 'a2'],
});
const ontology = createContext(onto);

export default ontology;
