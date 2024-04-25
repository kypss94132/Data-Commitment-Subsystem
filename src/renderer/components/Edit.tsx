interface EditProps {
  isNew: boolean;
  content: any;
  onAdd: Function;
}

function Edit({ isNew, content, onAdd }: EditProps) {
  console.log(content);
  return (
    <>
      <div className="btn" onClick={onAdd}>
        {isNew ? 'Add' : 'Confirm'}
      </div>
      <div className="grid gap-4 grid-cols-[minmax(20ch,_auto)_1fr]">
        {content}
      </div>
    </>
  );
}

export default Edit;
