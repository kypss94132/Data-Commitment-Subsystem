import { useContext, useEffect, useState } from 'react';
import ontology from '../Ontology';
import Edit from './Edit';
import { DISGetType } from '../../main/discore/type';

interface AtomProps {
  atomName: string | null;
}

function Atom({ atomName }: AtomProps) {
  const onto = useContext(ontology);
  const [isNew, setIsNew] = useState(false);
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  useEffect(() => {
    if (atomName === null) {
      console.log('atom Name is null');
      setIsNew(true);
      setName('');
      setDesc('');
    } else {
      setIsNew(false);
      const atom = onto.getAtom(atomName);
      if (atom === null) {
        alert('Atom not found');
      }
      setName(atom!.name);
      setDesc(atom!.description ?? '');
    }
  }, [atomName, onto]);

  function setAtom() {
    onto.setAtom({
      name,
      description: desc?.length === 0 ? null : desc,
    });
    setIsNew(false);
  }

  const content = (
    <>
      <div className="label">Name</div>
      <input
        className="input input-bordered"
        type="text"
        readOnly={!isNew}
        minLength={1}
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

  return <Edit isNew={isNew} content={content} onAdd={() => setAtom()} />;
}
export default Atom;
