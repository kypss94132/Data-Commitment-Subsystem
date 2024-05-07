import { useContext, useEffect, useState, JSX } from 'react';
import Atom from './components/Atom';
import { OntologyContext, OntologyDispatchContext } from './Ontology';
import Concept from './components/Concept';
import { DISGetType, DISSetType } from '../main/discore/type';
import BLView from './components/BLView';
import TabList from './components/TabList';
import Tab from './components/Tab';

enum Status {
  BLANK,
  ADD,
  EDIT,
}

function BooleanLattice() {
  const onto = useContext(OntologyContext);
  const dispatch = useContext(OntologyDispatchContext);

  const [tag, setTag] = useState('atom');
  // const [items, setItems] = useState([] as string[]);
  const [current, setCurrent] = useState<string | null>(null);
  const [atom, setAtom] = useState<DISSetType.Atom>({ name: '' });
  const [concept, setConcept] = useState<DISSetType.Concept>({
    name: '',
    latticeOfConcepts: [],
  });
  const [status, setStatus] = useState(Status.BLANK);

  useEffect(() => {
    if (status === Status.EDIT) {
      if (tag === 'atom') {
        setAtom(onto.getAtom(current!)!);
      } else {
        setConcept(onto.getConcept(current!)!);
      }
    } else if (status === Status.ADD) {
      if (tag === 'atom') {
        setAtom({ name: '' });
      } else {
        setConcept({ name: '', latticeOfConcepts: [] });
      }
    }
  }, [current, onto, status, tag]);

  const tab = ['atom', 'concept'].map((t) => (
    <Tab
      key={t}
      tag={t}
      active={tag === t}
      onClick={() => {
        setTag(t);
        setCurrent(null);
        setStatus(Status.BLANK);
      }}
    />
  ));

  const [atomNames, setAtomNames] = useState(
    onto.getAllAtoms().map((a) => a.name),
  );
  const [conceptNames, setConceptNames] = useState(
    onto.getAllConcepts().map((c) => c.name),
  );

  const items = tag === 'atom' ? atomNames : conceptNames;

  const list = items.map((i) => (
    <div
      key={i}
      className={`btn ${current === i && 'btn-active'}`}
      onClick={() => {
        setCurrent(i);
        setStatus(Status.EDIT);
      }}
    >
      {i}
    </div>
  ));

  let edit;
  if (status === Status.BLANK) {
    edit = <></>;
  } else if (tag === 'atom') {
    edit = (
      <Atom
        isNew={status === Status.ADD}
        atom={atom}
        setContent={setAtom}
        addAtom={() => {
          if (onto.hasAtom(atom.name)) {
            alert('Atom already exists');
            return;
          }
          onto.setAtom(atom);
          setStatus(Status.BLANK);
          setAtomNames(onto.getAllAtoms().map((a) => a.name));
          dispatch({ type: 'rerender' });
        }}
        updateAtom={() => {
          onto.setAtom(atom);
        }}
      />
    );
  } else {
    edit = (
      <Concept
        isNew={status === Status.ADD}
        concept={concept}
        atoms={atomNames}
        setContent={setConcept}
        addConcept={() => {
          if (onto.getConcept(concept.name) !== null) {
            alert('Concept already exists');
            return;
          }
          onto.setConcept(concept);
          setStatus(Status.BLANK);
          setConceptNames(onto.getAllConcepts().map((c) => c.name));
          dispatch({ type: 'rerender' });
        }}
        updateConcept={() => {
          onto.setConcept(concept);
        }}
      />
    );
  }

  function addItem() {
    setStatus(Status.ADD);
    setCurrent(null);
    setAtomNames(onto.getAllAtoms().map((a) => a.name));
    setConceptNames(onto.getAllConcepts().map((c) => c.name));
  }

  function delItem() {
    if (tag === 'atom') {
      onto.removeAtom(current!);
      setAtomNames(onto.getAllAtoms().map((a) => a.name));
    } else {
      onto.removeConcept(current!);
      setConceptNames(onto.getAllConcepts().map((c) => c.name));
    }
    setCurrent(null);
    setStatus(Status.BLANK);
  }

  return (
    <div className="flex flex-row h-full">
      {/* sidebar */}
      <div className="min-w-60 flex flex-col border">
        {/* <div role="tablist" className="tabs tabs-bordered">
          {tab}
        </div> */}
        <TabList
          tabs={['atom', 'concept']}
          activeTab={tag}
          onTabClick={(tab) => {
            setTag(tab);
            setCurrent(null);
            setStatus(Status.BLANK);
          }}
        />

        <div className="grow w-full">
          <div className="join join-vertical w-full">{list}</div>
        </div>

        <div className="flex flex-row w-full">
          <div className="btn btn-success w-1/2" onClick={addItem}>
            ADD
          </div>
          <div className="btn btn-error w-1/2" onClick={delItem}>
            DELETE
          </div>
        </div>
      </div>

      {/* main */}
      <div className="flex flex-col flex-grow">
        {/* upper view */}
        <div className="h-3/5">
          <BLView />
        </div>

        {/* lower edit */}
        <div className="h-2/5 border-t p-2 overflow-y-auto">{edit}</div>
      </div>
    </div>
  );
}

export default BooleanLattice;
