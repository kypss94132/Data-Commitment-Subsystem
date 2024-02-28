import { useContext, useState } from 'react';
import ontology from '../Ontology';

interface AtomProps {
  isNew: boolean;
  atomName: string;
}

function Atom({ isNew, atomName }: AtomProps) {
  // const [name, setName] = useState(name);
  // const [desc, setDesc] = useState(description);

  // if (isNew) {
  //   return <NewAtom />;
  // }
  const onto = useContext(ontology);
  const atom = onto.getAtom(atomName)!;

  return (
    <>
      <div className="btn">Edit</div>
      {/* <div className="btn">Edit</div>
      <div className="btn">Edit</div> */}
      <div className="grid gap-4 grid-cols-[minmax(20ch,_auto)_1fr]">
        <div className="label">Name</div>
        <input className="input input-bordered" type="text" value={atom.name} />
        <div className="label">Description</div>
        <textarea
          className="textarea textarea-bordered"
          value={atom.description!}
        />
      </div>
    </>
  );
}
export default Atom;
