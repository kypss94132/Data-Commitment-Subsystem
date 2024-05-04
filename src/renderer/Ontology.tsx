import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import DISOntology from '../main/discore/ontology';

const ontology = new DISOntology();
ontology.create();
ontology.setAtom({
  name: 'a1',
  description: 'This is a1',
});
ontology.setAtom({
  name: 'a2',
  description: 'This is a2',
});
ontology.setAtom({
  name: 'a3',
  description: 'This is a3',
});
ontology.setAtom({
  name: 'a4',
  description: 'This is a4',
});
ontology.setConcept({
  name: 'c1',
  latticeOfConcepts: ['a1', 'a2'],
});
ontology.setRootedGraph({
  name: 'r1',
  rootedAt: 'c1',
});
ontology.setVirtualConcept('vc1');
ontology.setVirtualConcept('vc2');
ontology.setVirtualConcept('vc3');
ontology.setVirtualConcept('vc4');
ontology.setRelation(
  {
    from: 'vc1',
    to: 'vc2',
    relation: 'is-a',
  },
  'r1',
);
ontology.setRelation(
  {
    from: 'vc1',
    to: 'vc3',
    relation: 'is-a',
  },
  'r1',
);
ontology.setRelation(
  {
    from: 'vc2',
    to: 'vc4',
    relation: 'is-a',
  },
  'r1',
);
ontology.setRelation(
  {
    from: 'vc3',
    to: 'vc4',
    relation: 'is-a',
  },
  'r1',
);

interface Props {
  children: ReactNode;
}

interface Action {
  type: 'rerender';
}

function ontologyReducer(onto: DISOntology, action: Action) {
  switch (action.type) {
    case 'rerender':
      console.log('rerender');
      return {};
    default:
      console.error('Unknown action type');
  }
}

export const OntologyContext = createContext(ontology);
export const OntologyDispatchContext = createContext<Dispatch<Action>>(
  {} as Dispatch<Action>,
);

export function OntologyProvider({ children }: Props) {
  const [onto, dispatch] = useReducer(ontologyReducer, ontology);

  return (
    <OntologyContext.Provider value={onto}>
      <OntologyDispatchContext.Provider value={dispatch}>
        {children}
      </OntologyDispatchContext.Provider>
    </OntologyContext.Provider>
  );
}
