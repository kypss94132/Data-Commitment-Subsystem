interface EditProps {
  isNew: boolean;
  content: JSX.Element;
  onAdd: any;
}

function Edit({ isNew, content, onAdd }: EditProps) {
  return (
    <>
      <div className={`btn ${isNew ? 'primary' : 'default'}`} onClick={onAdd}>
        {isNew ? 'Add' : 'Confirm'}
      </div>
      <div className="grid gap-4 grid-cols-[minmax(20ch,_auto)_1fr]">
        {content}
      </div>
    </>
  );
}

export default Edit;
