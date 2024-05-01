import { ChangeEvent, useContext, useState } from 'react';
import ontology from '../Ontology';
import Edit from './Edit';
import { DISSetType } from '../../main/discore/type';

interface ConceptProps {
  concept: DISSetType.Concept;
  isNew: boolean;
  atoms: string[];
  setContent: (atom: DISSetType.Concept) => void;
  addConcept: () => void;
  updateConcept: () => void;
}

function Concept({
  concept,
  isNew,
  atoms,
  setContent,
  addConcept,
  updateConcept,
}: ConceptProps) {
  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setContent({ ...concept, name: e.target.value });
  }

  function handleLatticeChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    if (concept.latticeOfConcepts.includes(name)) {
      setContent({
        ...concept,
        latticeOfConcepts: concept.latticeOfConcepts.filter((a) => a !== name),
      });
    } else {
      setContent({
        ...concept,
        latticeOfConcepts: [...concept.latticeOfConcepts, name],
      });
    }
  }

  function handleDescChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const desc: string = e.target.value;
    setContent({ ...concept, description: desc });
  }

  const lattice = atoms.map((a) => (
    <div key={a} className="label join-item">
      <input
        type="checkbox"
        checked={concept.latticeOfConcepts.includes(a)}
        className="checkbox checkbox-primary checkbox-sm mr-2"
        onChange={handleLatticeChange}
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
        onChange={handleNameChange}
      />
      <div className="label">Lattice of Concepts</div>
      <div className="join join-vertical w-max">{lattice}</div>
      <div className="label">Description</div>
      <textarea
        className="textarea textarea-bordered"
        value={concept.description!}
        onChange={handleDescChange}
      />
    </>
  );

  return (
    <Edit
      isNew={isNew}
      content={content}
      onCreate={() => {}}
      onUpdate={() => {}}
    />
  );
}

export default Concept;
