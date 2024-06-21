import { ArrowLongRightIcon } from '@heroicons/react/24/solid';

interface Props {
  atom: string;
}

function Mapping({ atom }: Props) {
  return (
    <div className="flex flex-row justify-start items-center gap-2">
      <div>{atom}</div>
      <ArrowLongRightIcon className="w-6 h-6" />
      <select className="select select-sm select-bordered">
        <option>Column 1</option>
        <option>Column 2</option>
        <option>Column 3</option>
      </select>
    </div>
  );
}

export default Mapping;
