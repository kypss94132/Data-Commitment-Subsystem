import { useContext, useState } from 'react';
import ontology from '../Ontology';
import Edit from './Edit';

interface AtomProps {
  isNew: boolean;
  atomName: string;
}

function Atom({ isNew, atomName }: AtomProps) {
  const onto = useContext(ontology);
  const atom = onto.getAtom(atomName);

  if (atom === null) {
    alert('Atom not found');
  }

  const [name, setName] = useState(atom!.name);
  const [desc, setDesc] = useState(atom!.description);

  const content = (
    <>
      <div className="label">Name</div>
      <input
        className="input input-bordered"
        type="text"
        readOnly
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <div className="label">Description</div>
      <textarea
        className="textarea textarea-bordered"
        value={desc}
        onChange={(e) => {
          setDesc(e.target.value);
        }}
      />
    </>
  );

  return Edit({ isNew, content, onAdd: () => {} });
}
export default Atom;
