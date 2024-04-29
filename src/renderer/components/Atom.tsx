import { ChangeEvent } from 'react';
import Edit from './Edit';
import { DISSetType } from '../../main/discore/type';

interface AtomProps {
  atom: DISSetType.Atom;
  setAtom: (atom: DISSetType.Atom) => void;
  isNew: boolean;
}

function Atom({ atom, setAtom, isNew }: AtomProps) {
  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setAtom({ ...atom!, name: e.target.value });
  }

  function handleDescChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const desc: string = e.target.value;
    setAtom({ ...atom!, description: desc });
  }

  const content = (
    <>
      <div className="label">Name</div>
      <input
        className="input input-bordered"
        type="text"
        readOnly={!isNew}
        minLength={1}
        value={atom?.name ?? ''}
        onChange={handleNameChange}
      />
      <div className="label">Description</div>
      <textarea
        className="textarea textarea-bordered"
        value={atom?.description ?? ''}
        onChange={handleDescChange}
      />
    </>
  );

  return <Edit isNew={isNew} content={content} onAdd={() => setAtom()} />;
}
export default Atom;
