import { useState } from 'react';
import { DISGetType, DISSetType } from '../../main/discore/type';
import { useOntology } from '../Ontology';
import { CheckIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
  graph: DISGetType.Graph | null;
  setGraph: (graph: DISSetType.Graph | null) => void;
}

enum Status {
  BLANK,
  ADD,
  EDIT,
}

function GraphEdit({ graph, setGraph }: Props) {
  const onto = useOntology();
  const [status, setStatus] = useState(Status.BLANK); // ['BLANK', 'ADD', 'EDIT']
  const datalist = onto.getAllConcepts().map((c) => <option value={c.name} />);

  let graphs = onto.getAllRootedGraphs().map((g) => {
    return <option value={g.name}>{g.name}</option>;
  });

  graphs = [
    <option disabled selected value={undefined}>
      Select One
    </option>,
    ...graphs,
  ];

  return (
    <div className="flex flex-col w-full border-b">
      <div className="flex flex-row justify-center items-center gap-2 w-full p-2">
        <button
          type="button"
          className="btn btn-sm btn-primary"
          disabled={status === Status.ADD}
          onClick={() => {
            setStatus(Status.ADD);
          }}
        >
          <PlusIcon className="size-4 stroke-[3]" />
        </button>
        <div className="flex flex-row flex-grow items-center justify-center gap-2">
          <div className="text-lg">Rooted Graph</div>
          {status === Status.ADD ? (
            <input
              className="input input-sm input-bordered"
              type="text"
              value={graph?.name ?? ''}
              onChange={(e) => {
                setGraph({ ...graph, name: e.target.value });
              }}
            />
          ) : (
            <select
              className="select select-bordered select-sm"
              value={graph?.name}
              onChange={(e) => {
                setStatus(Status.EDIT);
                if (e.target.value) {
                  setGraph(onto.getRootedGraph(e.target.value)!);
                }
              }}
            >
              {graphs}
            </select>
          )}

          <div className="text-lg">Is Rooted At </div>

          {status === Status.ADD ? (
            <>
              <input
                className="input input-sm input-bordered"
                type="text"
                list="concepts"
                value={graph?.rootedAt ?? ''}
                onChange={(e) => {
                  setGraph({ ...graph!, rootedAt: e.target.value });
                }}
              />
              <datalist id="concepts">{datalist}</datalist>
            </>
          ) : (
            <div className="text-lg font-bold">{graph?.rootedAt}</div>
          )}
        </div>
        <button
          type="button"
          className="btn btn-sm btn-error"
          disabled={status === Status.BLANK}
          onClick={() => {
            onto.removeRootedGraph(graph!.name);
            setGraph(null);
          }}
        >
          <XMarkIcon className="size-4 stroke-[3]" />
        </button>
      </div>
      <div className="flex flex-row gap-2 p-2 w-full items-center">
        <div>Description</div>
        <input
          className="input input-sm input-bordered flex-grow"
          disabled={status === Status.BLANK}
          value={graph?.description}
          onChange={(e) => setGraph({ ...graph!, description: e.target.value })}
        />
        <button
          type="button"
          disabled={status === Status.BLANK}
          className="btn btn-sm btn-circle btn-success"
          onClick={() => {
            if (status === Status.ADD) {
              if (onto.getRootedGraph(graph!.name)) {
                alert("Rooted Graph already exists");
                return;
              }
              setStatus(Status.EDIT);
            }
            onto.setRootedGraph(graph!);
          }}
        >
          <CheckIcon className="size-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}

export default GraphEdit;
