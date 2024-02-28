import { useContext } from 'react';
import ontology from '../Ontology';

interface ConceptProps {
  isNew: boolean;
  conceptName: string;
}

function Concept({ isNew, conceptName }: ConceptProps) {
  const onto = useContext(ontology);
  const concept = onto.getConcept(conceptName)!;
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

  return (
    <>
      <div className="btn">Edit</div>
      <div className="grid gap-4 grid-cols-[minmax(20ch,_auto)_1fr]">
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
      </div>
    </>
  );
}

export default Concept;
