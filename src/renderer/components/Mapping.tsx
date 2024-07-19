import { ArrowLongRightIcon } from '@heroicons/react/24/solid';

interface Props {
  atom: string;
  columns: string[];
}

function Mapping({ atom, columns }: Props) {
  const options = columns.map((c) => <option value={c}>{c}</option>);

  return (
    <div className="flex flex-row justify-start items-center gap-2">
      <div>{atom}</div>
      <ArrowLongRightIcon className="w-6 h-6" />
      <select className="select select-sm select-bordered">{options}</select>
    </div>
  );
}

export default Mapping;
