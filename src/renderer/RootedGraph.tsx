import { useEffect, useState } from 'react';
import { CheckIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useOntology, useRenderDispatch, useRenderSignal } from './Ontology';
import RGView from './components/RGView';
import { DISGetType } from '../main/discore/type';
import GraphEdit from './components/GraphEdit';

enum Status {
  BLANK,
  ADD,
  EDIT,
}

function RootedGraph() {
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [currentEdge, setCurrentEdge] = useState<DISGetType.Edge | null>(null);
  const [status, setStatus] = useState(Status.BLANK); // ['BLANK', 'ADD', 'EDIT'
  const onto = useOntology();
  const dispatch = useRenderDispatch();
  const renderSignal = useRenderSignal();
  const [graph, setGraph] = useState<DISGetType.Graph | null>(null);
  const [possibleNodes, setPossibleNodes] = useState<string[]>([
    ...onto.getAllAtoms().map((a) => a.name),
    ...onto.getAllConcepts().map((c) => c.name),
    ...onto.getAllVirtualConcepts().map((c) => c.name),
  ]);
  const [stasDesc, setStasDesc] = useState<string>('');

  const datalist = possibleNodes.map((node) => <option value={node} />);

  useEffect(() => {
    setPossibleNodes([
      ...onto.getAllAtoms().map((a) => a.name),
      ...onto.getAllConcepts().map((c) => c.name),
      ...onto.getAllVirtualConcepts().map((c) => c.name),
    ]);
  }, [onto, renderSignal]);

  const edit = (
    <tr key={-1}>
      <th>
        <button type="submit" className="btn btn-sm btn-primary">
          <CheckIcon className="size-4 stroke-[3]" />
        </button>
      </th>
      <td>
        <input
          list="from-nodes"
          id="from"
          type="text"
          name="from"
          className="input input-sm input-bordered"
        />
        <datalist id="from-nodes">{datalist}</datalist>
      </td>
      <td>
        <input
          list="to-nodes"
          id="to"
          type="text"
          name="to"
          className="input input-sm input-bordered"
        />
        <datalist id="to-nodes">{datalist}</datalist>
      </td>
      <td>
        <input
          type="text"
          name="relation"
          className="input input-sm input-bordered"
          defaultValue="is-a"
        />
      </td>
    </tr>
  );

  let rows;
  if (graph !== null) {
    const edges = onto.getAllRelations(graph.name);
    // console.log(edges);
    rows = edges.map((edge, idx) => (
      <tr
        key={idx}
        onClick={() => {
          setCurrentIdx(idx);
          const e = onto.getRelation(edge, graph!.name)!;
          setCurrentEdge(e);
          setStasDesc(e.predicate ?? '');
        }}
        className={currentIdx === idx ? 'bg-gray-200' : 'bg-white'}
      >
        <th className="w-10">
          <button
            type="button"
            className="btn btn-sm btn-error"
            onClick={() => {
              onto.removeRelation(
                { from: edge.from, to: edge.to, relation: edge.relation },
                graph.name,
              );
              dispatch({ type: 'rerender' });
            }}
          >
            <XMarkIcon className="size-4 stroke-[3]" />
          </button>
        </th>
        <td>{edge.from}</td>
        <td>{edge.to}</td>
        <td>{edge.relation}</td>
      </tr>
    ));
  }

  return (
    <div className="flex flex-col h-full">
      <GraphEdit graph={graph} setGraph={setGraph} onto={onto} />

      <div className="flex flex-row h-full w-full">
        <div className="flex flex-col justify-center items-center w-1/2 h-full border-r">
          <div className="flex flex-col overflow-y-auto w-full h-1/2 border-b">
            <div className="grow">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);

                  try {
                    onto.setRelation(
                      {
                        from: formData.get('from') as string,
                        to: formData.get('to') as string,
                        relation: formData.get('relation') as string,
                      },
                      graph!.name,
                    );
                    dispatch({ type: 'rerender' });
                    setStatus(Status.BLANK);
                  } catch (err) {
                    alert(err.message);
                  }
                }}
              >
                <table className="table w-full">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>
                        {status === Status.BLANK && graph !== null ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setStatus(Status.ADD);
                            }}
                          >
                            <PlusIcon className="size-4 stroke-[3]" />
                          </button>
                        ) : (
                          '#'
                        )}
                      </th>
                      <th>From</th>
                      <th>To</th>
                      <th>Relation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status === Status.ADD && edit}
                    {rows}
                  </tbody>
                </table>
              </form>
            </div>
          </div>
          <div className="flex flex-col h-1/2 w-full">
            <div className="text-lg text-center">Statistical Description</div>
            <textarea
              className="flex-grow m-2 mt-0 border h-full p-2 resize-none"
              disabled={currentIdx === null || status === Status.ADD}
              value={stasDesc}
              onChange={(e) => {
                setStasDesc(e.target.value);
              }}
            />
            <button
              type="button"
              className="btn btn-primary"
              disabled={currentIdx === null || status === Status.ADD}
              onClick={() => {
                onto.setRelation(
                  {
                    ...currentEdge!,
                    predicate: stasDesc,
                  },
                  graph!.name,
                );
              }}
            >
              SAVE
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center w-1/2">
          {graph && <RGView graphName={graph.name} />}
        </div>
      </div>
    </div>
  );
}

export default RootedGraph;
