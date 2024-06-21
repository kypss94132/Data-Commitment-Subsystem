import { DataFrame } from 'data-forge';
import * as dataForge from 'data-forge';
import { useState } from 'react';
import Mapping from './components/Mapping';

export default function Prereason() {
  const [df, setDf] = useState<dataForge.DataFrame<number, any>>(
    new DataFrame(),
  );

  const table = (
    <div className="overflow-auto flex-grow h-4">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th />
            {/* <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th> */}
            {df!.getColumnNames().map((name) => (
              <th>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {df!.toRows().map((row, idx) => (
            <tr>
              <th>{idx + 1}</th>
              {row.map((cell) => (
                <td>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">
      <form
        className="flex flex-col"
        onSubmit={async (e) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const file = formData.get('csv-file') as File;

          const fileContent = await window.file.open(file.path);
          // console.log(fileContent);
          setDf(dataForge.fromCSV(fileContent));
          console.log(df.getColumnNames());
        }}
      >
        <div className="label">Pick a CSV file</div>
        <input
          type="file"
          name="csv-file"
          accept=".csv"
          className="file-input file-input-bordered w-full max-w-xs"
        />
        <button className="btn btn-primary">Load</button>
      </form>
      <Mapping atom="test" />
      {table}
    </div>
  );
}
