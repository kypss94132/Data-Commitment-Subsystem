import { useContext, useState } from 'react';
import { OntologyContext } from './Ontology';

function RootedGraph() {
  const [current, setCurrent] = useState(0);
  const onto = useContext(OntologyContext);
  const edges = onto.getAllRelations('r1');

  const rows = edges.map((edge, idx) => (
    <tr
      onClick={() => setCurrent(idx)}
      className={current === idx ? 'bg-gray-200' : 'bg-white'}
    >
      <th>{idx + 1}</th>
      <td>{edge.from}</td>
      <td>{edge.to}</td>
      <td>{edge.relation}</td>
    </tr>
  ));

  return (
    <div className="flex flex-row">
      <div className="flex flex-col justify-center items-center w-1/2">
        <div className="overflow-y-auto w-full flex-grow">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>From</th>
                <th>To</th>
                <th>Relation</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
        <div className="flex flex-row w-full">
          <div className="btn btn-success w-1/2">
            ADD
          </div>
          <div className="btn btn-error w-1/2">
            DELETE
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center w-1/2">right</div>
    </div>
  );
}

export default RootedGraph;
