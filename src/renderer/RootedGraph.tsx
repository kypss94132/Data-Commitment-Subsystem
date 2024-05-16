import { useState } from 'react';
import { useOntology, useRenderDispatch } from './Ontology';
import TabList from './components/TabList';
import RGView from './components/RGView';
import { DISGetType } from '../main/discore/type';

enum Status {
  BLANK,
  ADD,
  EDIT,
}

function RootedGraph() {
  const [current, setCurrent] = useState<number | null>(null);
  const [status, setStatus] = useState(Status.BLANK); // ['BLANK', 'ADD', 'EDIT'
  const onto = useOntology();
  const dispatch = useRenderDispatch();
  const [graph, setGraph] = useState<DISGetType.Graph | null>(null);
  const [tag, setTag] = useState('edge');

  let graphs = onto.getAllRootedGraphs().map((g) => {
    return <option value={g.name}>{g.name}</option>;
  });

  graphs = [
    <option disabled selected value={undefined}>
      Select One
    </option>,
    ...graphs,
  ];

  const edit = (
    <tr key={-1}>
      <th>
        <button type="submit" className="btn btn-sm btn-primary">
          √
        </button>
      </th>
      <td>
        <input type="text" name="from" className="input input-bordered w-24" />
      </td>
      <td>
        <input type="text" name="to" className="input input-bordered" />
      </td>
      <td>
        <input type="text" name="relation" className="input input-bordered" />
      </td>
    </tr>
  );

  let rows;
  if (graph !== null) {
    if (tag === 'edge') {
      const edges = onto.getAllRelations(graph.name);
      console.log(edges);
      rows = edges.map((edge, idx) => (
        <tr
          key={idx}
          onClick={() => setCurrent(idx)}
          className={current === idx ? 'bg-gray-200' : 'bg-white'}
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
              ×
            </button>
          </th>
          <td>{edge.from}</td>
          <td>{edge.to}</td>
          <td>{edge.relation}</td>
        </tr>
      ));
    } else {
      const vcs = onto.getAllVirtualConcepts();
      console.log(vcs);
      rows = vcs.map((vc, idx) => {
        return (
          <tr key={idx}>
            <th>
              <button
                type="button"
                className="btn btn-sm btn-error"
                onClick={() => {
                  onto.removeVirtualConcept(vc.name);
                  dispatch({ type: 'rerender' });
                }}
              >
                ×
              </button>
            </th>
            <td>{vc.name}</td>
            <td />
            <td />
          </tr>
        );
      });
    }
  }

  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col justify-center items-center w-1/2 h-full border-r">
        <div className="flex flex-row items-center gap-2">
          <div className="text-lg">Rooted Graph</div>
          <select
            className="select select-bordered select-sm"
            value={graph?.name}
            onChange={(e) =>
              e.target.value && setGraph(onto.getRootedGraph(e.target.value))
            }
          >
            {graphs}
          </select>
          <div className="text-lg">Is Rooted At </div>
          <div className="text-lg font-bold">{graph?.rootedAt}</div>
        </div>

        <div className="flex flex-col overflow-y-auto w-full h-1/2 border-b">
          {/* <TabList
            tabs={['edge', 'virtual concept']}
            activeTab={tag}
            onTabClick={(tab) => {
              setTag(tab);
              setCurrent(null);
              setStatus(Status.BLANK);
            }}
          /> */}
          <div className="grow">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

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
              }}
            >
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th>
                      {status === Status.BLANK ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setStatus(Status.ADD);
                          }}
                        >
                          +
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
        <div className="flex flex-col h-1/2">
          <textarea />
          <div className="btn btn-primary">SAVE</div>
        </div>
      </div>

      <div className="flex justify-center items-center w-1/2">
        {graph && <RGView graphName={graph.name} />}
      </div>
    </div>
  );
}

export default RootedGraph;
