import { JSX } from 'react';

interface EditProps {
  isNew: boolean;
  content: JSX.Element;
  onCreate: any;
  onUpdate: any;
}

function Edit({ isNew, content, onUpdate, onCreate }: EditProps) {
  return (
    <>
      <div className={`btn ${isNew ? 'primary' : 'default'}`} onClick={isNew ? onCreate : onUpdate}>
        {isNew ? 'Add' : 'Confirm'}
      </div>
      <div className="grid gap-4 grid-cols-[minmax(20ch,_auto)_1fr]">
        {content}
      </div>
    </>
  );
}

export default Edit;
