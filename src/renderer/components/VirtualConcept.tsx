import { ChangeEvent } from 'react';
import Edit from './Edit';
import { DISSetType } from '../../main/discore/type';

interface AtomProps {
  virtualConcept: DISSetType.VirtualConcept;
  isNew: boolean;
  setContent: (atom: DISSetType.Atom) => void;
  addVirtualConcept: () => void;
  updateVirtualConcept: () => void;
}

function VirtualConcept({
  virtualConcept,
  isNew,
  setContent,
  addVirtualConcept,
  updateVirtualConcept,
}: AtomProps) {
  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setContent({ ...virtualConcept, name: e.target.value });
  }

  function handleDescChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const desc: string = e.target.value;
    setContent({ ...virtualConcept, description: desc });
  }

  const content = (
    <>
      <div className="label">Name</div>
      <input
        className="input input-bordered"
        type="text"
        readOnly={!isNew}
        minLength={1}
        value={virtualConcept?.name ?? ''}
        onChange={handleNameChange}
      />
      <div className="label">Description</div>
      <textarea
        className="textarea textarea-bordered"
        value={virtualConcept?.description ?? ''}
        onChange={handleDescChange}
      />
    </>
  );

  return (
    <Edit
      isNew={isNew}
      content={content}
      onCreate={addVirtualConcept}
      onUpdate={updateVirtualConcept}
    />
  );
}
export default VirtualConcept;
