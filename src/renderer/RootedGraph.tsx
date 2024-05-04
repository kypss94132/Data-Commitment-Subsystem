import { useContext, useState } from 'react';
import { OntologyContext } from './Ontology';

enum Status {
  BLANK,
  ADD,
  EDIT,
}

function RootedGraph() {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState(Status.BLANK); // ['BLANK', 'ADD', 'EDIT'
  const onto = useContext(OntologyContext);
  const edges = onto.getAllRelations('r1');
  const edit = (
    <tr>
      <th>*</th>
      <td>
        <input type="text" />
      </td>
      <td>
        <input type="text" />
      </td>
      <td>
        <input type="text" />
      </td>
      <td>
        <div className="btn btn-sm btn-primary" onClick={() => setStatus(Status.BLANK)}>√</div>
      </td>
    </tr>
  );

  const rows = edges.map((edge, idx) => (
    <tr
      onClick={() => setCurrent(idx)}
      className={current === idx ? 'bg-gray-200' : 'bg-white'}
    >
      <th className="w-5">{idx + 1}</th>
      <td>{edge.from}</td>
      <td>{edge.to}</td>
      <td>{edge.relation}</td>
      <td className="w-5">X</td>
    </tr>
  ));

  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col justify-center items-center w-1/2 h-full">
        <div className="flex flex-col overflow-y-auto w-full h-1/2">
          <div className="grow">
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>#</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Relation</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {status === Status.ADD && edit}
                {rows}
              </tbody>
            </table>
          </div>
          {/* <div className="grow" /> */}
          <div className="flex flex-row w-full">
            <div className="btn btn-success w-1/2" onClick={() => setStatus(Status.ADD)}>ADD</div>
            <div className="btn btn-error w-1/2">DELETE</div>
          </div>
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
