export default function ResultsTable({ results }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Validation Results</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">File</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Valid</th>
            <th className="p-2 border">Invalid</th>
            <th className="p-2 border">Validated File</th>
            <th className="p-2 border">Failed File</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res) => (
            <tr key={res.file} className="text-center">
              <td className="p-2 border">{res.file}</td>
              <td className="p-2 border">{res.total}</td>
              <td className="p-2 border">{res.valid}</td>
              <td className="p-2 border">{res.invalid}</td>
              <td className="p-2 border">
                <a
                  href={`http://localhost:8000${res.validated_download}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Download
                </a>
              </td>
              <td className="p-2 border">
                <a
                  href={`http://localhost:8000${res.failed_download}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-600 underline"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
