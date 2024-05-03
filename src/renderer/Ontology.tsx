import { createContext, useState } from 'react';
import DISOntology from '../main/discore/ontology';

const [onto, setOnto] = useState(new DISOntology());
onto.create();
onto.setAtom({
  name: 'a1',
  description: 'This is a1',
});
onto.setAtom({
  name: 'a2',
  description: 'This is a2',
});
onto.setAtom({
  name: 'a3',
  description: 'This is a3',
});
onto.setAtom({
  name: 'a4',
  description: 'This is a4',
});
onto.setConcept({
  name: 'c1',
  latticeOfConcepts: ['a1', 'a2'],
});
const OntologyContext = createContext(onto);

export default OntologyContext;
