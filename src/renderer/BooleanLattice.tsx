/**
 * Although this width or height won't be used,
 * all the element, which has a flex-grow class,
 * must have a width or a height on the target axis.
 * Otherwise, the element will have some unexpected problem.
 */

import { useDeferredValue, useEffect, useState } from 'react';
import Atom from './components/Atom';
import { useOntology, useRenderDispatch } from './Ontology';
import Concept from './components/Concept';
import { DISSetType } from '../main/discore/type';
import BLView from './components/BLView';
import TabList from './components/TabList';
import VirtualConcept from './components/VirtualConcept';

enum Status {
  BLANK,
  ADD,
  EDIT,
}

function BooleanLattice() {
  const onto = useOntology();
  const dispatch = useRenderDispatch();

  const [tag, setTag] = useState('atom');
  const [current, setCurrent] = useState<string | null>(null);
  const [atom, setAtom] = useState<DISSetType.Atom>({ name: '' });
  const [concept, setConcept] = useState<DISSetType.Concept>({
    name: '',
    latticeOfConcepts: [],
  });
  const [vconcept, setVconcept] = useState<DISSetType.VirtualConcept>({
    name: '',
  });
  const [status, setStatus] = useState(Status.BLANK);

  // console.log(onto.getAllVirtualConcepts());

  useEffect(() => {
    if (status === Status.EDIT) {
      if (tag === 'atom') {
        setAtom(onto.getAtom(current!)!);
      } else if (tag === 'concept') {
        setConcept(onto.getConcept(current!)!);
      } else {
        setVconcept(onto.getVirtualConcept(current!)!);
      }
    } else if (status === Status.ADD) {
      if (tag === 'atom') {
        setAtom({ name: '' });
      } else if (tag === 'concept') {
        setConcept({ name: '', latticeOfConcepts: [] });
      } else {
        setVconcept({ name: '' });
      }
    }
  }, [current, onto, status, tag]);

  const [atomNames, setAtomNames] = useState(
    onto.getAllAtoms().map((a) => a.name),
  );
  const [conceptNames, setConceptNames] = useState(
    onto.getAllConcepts().map((c) => c.name),
  );

  const [vconceptNames, setVconceptNames] = useState(
    onto.getAllVirtualConcepts().map((c) => c.name),
  );

  let items;

  if (tag === 'atom') {
    items = atomNames;
  } else if (tag === 'concept') {
    items = conceptNames;
  } else {
    items = vconceptNames;
  }

  // const items = tag === 'atom' ? atomNames : conceptNames;

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
  } else if (tag === 'concept') {
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
          dispatch({ type: 'rerender' });
        }}
      />
    );
  } else {
    edit = (
      <VirtualConcept
        isNew={status === Status.ADD}
        virtualConcept={vconcept}
        setContent={setVconcept}
        addVirtualConcept={() => {
          if (onto.getVirtualConcept(vconcept.name) !== null) {
            alert('Virtual Concept already exists');
            return;
          }
          onto.setVirtualConcept(vconcept);
          setStatus(Status.BLANK);
          setVconceptNames(onto.getAllVirtualConcepts().map((c) => c.name));
          // dispatch({ type: 'rerender' });
        }}
        updateVirtualConcept={() => {
          onto.setVirtualConcept(vconcept);
        }}
      />
    );
  }

  function addItem() {
    setStatus(Status.ADD);
    setCurrent(null);
    setAtomNames(onto.getAllAtoms().map((a) => a.name));
    setConceptNames(onto.getAllConcepts().map((c) => c.name));
    setVconceptNames(onto.getAllVirtualConcepts().map((c) => c.name));
  }

  function delItem() {
    if (tag === 'atom') {
      onto.removeAtom(current!);
      setAtomNames(onto.getAllAtoms().map((a) => a.name));
    } else if (tag === 'concept') {
      onto.removeConcept(current!);
      setConceptNames(onto.getAllConcepts().map((c) => c.name));
    } else {
      onto.removeVirtualConcept(current!);
      setVconceptNames(onto.getAllVirtualConcepts().map((c) => c.name));
    }
    setCurrent(null);
    setStatus(Status.BLANK);
    dispatch({ type: 'rerender' });
  }

  const blView = useDeferredValue(<BLView />);

  return (
    <div className="flex flex-row h-full">
      {/* sidebar */}
      <div className="min-w-60 flex flex-col border">
        <TabList
          tabs={['atom', 'concept', 'virtualConcept']}
          activeTab={tag}
          onTabClick={(tab) => {
            setTag(tab);
            setCurrent(null);
            setStatus(Status.BLANK);
          }}
        />

        <div className="flex-grow w-full">
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
      <div className="flex flex-col flex-grow w-10 h-full">
        {/* upper view */}
        <div className="h-3/5">
          <BLView />
        </div>

        {/* lower edit */}
        <div className="h-2/5 border-t p-2">{edit}</div>
      </div>
    </div>
  );
}

export default BooleanLattice;
