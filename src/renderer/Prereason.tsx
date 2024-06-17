export default function Prereason() {
  return (
    <div>
      <form
        className="flex flex-col"
        onSubmit={async (e) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const file = formData.get('csv-file') as File;

          const fileContent = await window.file.open(file.path);
          console.log(fileContent);
        }}
      >
        <div className="label">
          Pick a CSV file
        </div>
        <input
          type="file"
          name="csv-file"
          accept=".csv"
          className="file-input file-input-bordered w-full max-w-xs"
        />
        <button className="btn btn-primary">Load</button>
      </form>
    </div>
  );
}
