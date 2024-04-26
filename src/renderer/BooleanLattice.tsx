import { useContext, useState } from 'react';
import Atom from './components/Atom';
import ontology from './Ontology';
import Concept from './components/Concept';

function Tab({
  tag,
  active,
  onClick,
}: {
  tag: string;
  active: boolean;
  onClick: any;
}) {
  return (
    <div
      role="tab"
      className={`tab ${active && 'tab-active'}`}
      onClick={onClick}
    >
      {tag.charAt(0).toUpperCase() + tag.slice(1)}
    </div>
  );
}

function BooleanLattice() {
  const onto = useContext(ontology);

  const [tag, setTag] = useState('atom');
  // const [items, setItems] = useState([] as string[]);
  const [current, setCurrent] = useState<string | null>(null);

  const tab = ['atom', 'concept'].map((t) => (
    <Tab
      key={t}
      tag={t}
      active={tag === t}
      onClick={() => {
        setTag(t);
        setCurrent(null);
      }}
    />
  ));

  const atomNames = onto.getAllAtoms().map((a) => a.name);
  const conceptNames = onto.getAllConcepts().map((c) => c.name);

  const items = tag === 'atom' ? atomNames : conceptNames;

  const list = items.map((i) => (
    <div
      key={i}
      className={`btn ${current === i && 'btn-active'}`}
      onClick={() => setCurrent(i)}
    >
      {i}
    </div>
  ));

  let edit;
  if (current === null) {
    edit = <></>;
  } else if (tag === 'atom') {
    edit = <Atom atomName={current} />;
  } else {
    edit = <Concept isNew={false} conceptName={current} />;
  }

  const addItem = () => {
    console.log('add');
    edit = <Atom atomName={null} />;
    // setCurrent(null);
  };

  function delItem() {
    if (tag === 'atom') {
      onto.removeAtom(current!);
    } else {
      onto.removeConcept(current!);
    }
  }

  return (
    <div className="flex flex-row h-full">
      {/* sidebar */}
      <div className="min-w-60 flex flex-col border">
        <div role="tablist" className="tabs tabs-bordered">
          {tab}
        </div>

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
      <div className="flex flex-col flex-grow">
        {/* upper view */}
        <div className="h-3/5">
          <h1>up</h1>
        </div>

        {/* lower edit */}
        <div className="h-2/5 border-t p-2 overflow-y-auto">{edit}</div>
      </div>
    </div>
  );
}

export default BooleanLattice;
