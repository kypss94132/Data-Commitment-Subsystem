import { useContext, useState, useId } from 'react';
import { OntologyContext, OntologyDispatchContext } from './Ontology';
import TabList from './components/TabList';

enum Status {
  BLANK,
  ADD,
  EDIT,
}

function RootedGraph() {
  const [current, setCurrent] = useState<number | null>(null);
  const [status, setStatus] = useState(Status.BLANK); // ['BLANK', 'ADD', 'EDIT'
  const onto = useContext(OntologyContext);
  const dispatch = useContext(OntologyDispatchContext);
  const [graphName, setGraphName] = useState('r1');
  const [tag, setTag] = useState('edge');
  const edit = (
    <tr key={-1}>
      <th>
        <button type="submit" className="btn btn-sm btn-primary">
          √
        </button>
      </th>
      <td>
        <input type="text" name="from" className="input" />
      </td>
      <td>
        <input type="text" name="to" className="input" />
      </td>
      <td>
        <input type="text" name="relation" className="input" />
      </td>
    </tr>
  );

  let rows;
  if (tag === 'edge') {
    const edges = onto.getAllRelations(graphName);
    console.log(edges);
    rows = edges.map((edge, idx) => (
      <tr
        key={idx}
        onClick={() => setCurrent(idx)}
        className={current === idx ? 'bg-gray-200' : 'bg-white'}
      >
        <th className="w-5">
          <button
            type="button"
            className="btn btn-sm btn-error"
            onClick={() => {
              onto.removeRelation(
                { from: edge.from, to: edge.to, relation: edge.relation },
                graphName,
              );
              dispatch({ type: 'rerender' });
            }}
          >
            X
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
              X
            </button>
          </th>
          <td>{vc.name}</td>
          <td />
          <td />
        </tr>
      );
    });
  }

  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col justify-center items-center w-1/2 h-full border-r">
        <div className="flex flex-col overflow-y-auto w-full h-1/2 border-b">
          <TabList
            tabs={['edge', 'virtual concept']}
            activeTab={graphName}
            onTabClick={(tab) => {
              setTag(tab);
              setCurrent(null);
              setStatus(Status.BLANK);
              dispatch({ type: 'rerender' });
            }}
          />
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
                  graphName,
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
          {/* <div className="grow" /> */}
          {/* <div className="flex flex-row w-full">
            <button
              className="btn btn-success w-1/2"
              onClick={() => setStatus(Status.ADD)}
            >
              ADD
            </button>
            <div className="btn btn-error w-1/2">DELETE</div>
          </div> */}
        </div>
        <div className="flex flex-col h-1/2">
          <textarea />
          <div className="btn btn-primary">SAVE</div>
        </div>
      </div>

      <div className="flex justify-center items-center w-1/2">right</div>
    </div>
  );
}

export default RootedGraph;
