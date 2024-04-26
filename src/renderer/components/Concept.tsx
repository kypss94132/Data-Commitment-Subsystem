import { useContext, useState } from 'react';
import ontology from '../Ontology';
import Edit from './Edit';

interface ConceptProps {
  conceptName: string;
}

function Concept({ conceptName }: ConceptProps) {
  const onto = useContext(ontology);
  const concept = onto.getConcept(conceptName)!;
  const [isNew, setIsNew] = useState(false);
  const atoms = onto.getAllAtoms().map((a) => a.name);
  const lattice = atoms.map((a) => (
    <div key={a} className="label join-item">
      <input
        type="checkbox"
        defaultChecked={concept.latticeOfConcepts?.includes(a)}
        className="checkbox checkbox-primary checkbox-sm mr-2"
      />
      <span className="label-text">{a}</span>
    </div>
  ));

  const content = (
    <>
      <div className="label">Name</div>
      <input
        className="input input-bordered"
        type="text"
        value={concept.name}
      />
      <div className="label">Lattice of Concepts</div>
      <div className="join join-vertical w-max">{lattice}</div>
      <div className="label">Description</div>
      <textarea
        className="textarea textarea-bordered"
        value={concept.description!}
      />
    </>
  );

  return <Edit isNew={isNew} content={content} onAdd={() => {}} />;
}

export default Concept;
