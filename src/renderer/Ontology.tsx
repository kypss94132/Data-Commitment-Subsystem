import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
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

interface Signal {
  signal: string;
}

function ontologyRenderReducer(render: string, action: Action) {
  switch (action.type) {
    case 'rerender':
      console.log('rerender');
      return uuidv4();
    default:
      throw Error('Unknown action type');
  }
}

export const OntologyContext = createContext(ontology);
export const OntologyRenderSignalContext = createContext(uuidv4());
export const OntologyRenderDispatchContext = createContext<Dispatch<Action>>(
  {} as Dispatch<Action>,
);

export function useOntologyRenderSignal() {
  return useContext(OntologyRenderSignalContext);
}

export function useOntology() {
  return useContext(OntologyContext);
}

export function useOntologyRenderDispatch() {
  return useContext(OntologyRenderDispatchContext);
}

export function OntologyProvider({ children }: Props) {
  const [onto, setOnto] = useState(ontology);
  const [rerender, dispatch] = useReducer(ontologyRenderReducer, uuidv4());

  return (
    <OntologyContext.Provider value={onto}>
      <OntologyRenderSignalContext.Provider value={rerender}>
        <OntologyRenderDispatchContext.Provider value={dispatch}>
          {children}
        </OntologyRenderDispatchContext.Provider>
      </OntologyRenderSignalContext.Provider>
    </OntologyContext.Provider>
  );
}
