import { ChangeEvent } from 'react';
import Edit from './Edit';
import { DISSetType } from '../../main/discore/type';

interface AtomProps {
  atom: DISSetType.Atom;
  isNew: boolean;
  setContent: (atom: DISSetType.Atom) => void;
  addAtom: () => void;
  updateAtom: () => void;
}

function Atom({ atom, setContent, isNew, addAtom, updateAtom }: AtomProps) {
  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setContent({ ...atom, name: e.target.value });
  }

  function handleDescChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const desc: string = e.target.value;
    setContent({ ...atom, description: desc });
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

  return (
    <Edit
      isNew={isNew}
      content={content}
      onCreate={addAtom}
      onUpdate={updateAtom}
    />
  );
}
export default Atom;
