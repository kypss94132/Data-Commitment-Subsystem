import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import DISOntology from '../main/discore/ontology';

const ontology = new DISOntology();
// ontology.create();
// ontology.setAtom({
//   name: 'a1',
//   description: 'This is a1',
// });
// ontology.setAtom({
//   name: 'a2',
//   description: 'This is a2',
// });
// ontology.setAtom({
//   name: 'a3',
//   description: 'This is a3',
// });
// ontology.setAtom({
//   name: 'a4',
//   description: 'This is a4',
// });
// ontology.setConcept({
//   name: 'c1',
//   latticeOfConcepts: ['a1', 'a2'],
// });
// ontology.setRootedGraph({
//   name: 'r1',
//   rootedAt: 'c1',
// });
// ontology.setVirtualConcept({
//   name: 'vc1',
//   description: 'This is vc1',
// });
// ontology.setVirtualConcept({
//   name: 'vc2',
//   description: 'This is vc2',
// });
// ontology.setVirtualConcept({
//   name: 'vc3',
//   description: 'This is vc3',
// });
// ontology.setVirtualConcept({
//   name: 'vc4',
//   description: 'This is vc4',
// });
// ontology.setRelation(
//   {
//     from: 'vc1',
//     to: 'vc2',
//     relation: 'is-a',
//   },
//   'r1',
// );
// ontology.setRelation(
//   {
//     from: 'vc1',
//     to: 'vc3',
//     relation: 'is-a',
//   },
//   'r1',
// );
// ontology.setRelation(
//   {
//     from: 'vc2',
//     to: 'vc4',
//     relation: 'is-a',
//   },
//   'r1',
// );
// ontology.setRelation(
//   {
//     from: 'vc3',
//     to: 'vc4',
//     relation: 'is-a',
//   },
//   'r1',
// );

interface Props {
  children: ReactNode;
}

interface RenderAction {
  type: 'rerender';
}

export interface OntologyAction {
  type: string;
  filePath?: string;
  fileContent?: string;
}

interface Signal {
  signal: string;
}

let currentFilePath: string;

function ontologyReducer(onto: DISOntology, action: OntologyAction) {
  console.log('Ontology action:', action);
  switch (action.type) {
    case 'new': {
      const newOnto = new DISOntology();
      newOnto.create();
      return newOnto;
    }
    case 'open': {
      const newOnto = new DISOntology();
      currentFilePath = action.filePath!;
      newOnto.loadFromString(action.fileContent!);
      return newOnto;
    }
    case 'save': {
      const saveContent = onto.save();
      window.file.save(currentFilePath, saveContent);
      return onto;
    }
    case 'saveAs': {
      const saveContent = onto.save();
      currentFilePath = action.filePath!;
      window.file.save(currentFilePath, saveContent);
      return onto;
    }
    default:
      throw Error(`Unknown action type: ${action.type}`);
  }
}

function renderReducer(render: string, action: RenderAction) {
  switch (action.type) {
    case 'rerender':
      console.log('rerender');
      return uuidv4();
    default:
      throw Error('Unknown action type');
  }
}

const OntologyContext = createContext(ontology);
const OntologyDispatchContext = createContext<Dispatch<OntologyAction>>(
  {} as Dispatch<OntologyAction>,
);
const RenderSignalContext = createContext(uuidv4());
const RenderDispatchContext = createContext<Dispatch<RenderAction>>(
  {} as Dispatch<RenderAction>,
);

export function useRenderSignal() {
  return useContext(RenderSignalContext);
}

export function useOntology() {
  return useContext(OntologyContext);
}

export function useRenderDispatch() {
  return useContext(RenderDispatchContext);
}

export function useOntologyDispatch() {
  return useContext(OntologyDispatchContext);
}

export function OntologyProvider({ children }: Props) {
  const [onto, ontologyDispatch] = useReducer(ontologyReducer, ontology);
  const [render, renderDispatch] = useReducer(renderReducer, uuidv4());

  window.file.on((type, filePath?, fileContent?) => {
    console.log('File event:', type, filePath, fileContent);
    ontologyDispatch({
      type: type as string,
      filePath: filePath as string,
      fileContent: fileContent as string,
    });
  });

  return (
    <OntologyContext.Provider value={onto}>
      <OntologyDispatchContext.Provider value={ontologyDispatch}>
        <RenderSignalContext.Provider value={render}>
          <RenderDispatchContext.Provider value={renderDispatch}>
            {children}
          </RenderDispatchContext.Provider>
        </RenderSignalContext.Provider>
      </OntologyDispatchContext.Provider>
    </OntologyContext.Provider>
  );
}
