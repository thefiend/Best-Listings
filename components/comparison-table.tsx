// components/comparison-table.tsx
interface ComparisonTableProps {
  headers: string[]
  rows: string[][]
  winnerColumn?: number  // 0-indexed column index to highlight
}

export function ComparisonTable({ headers, rows, winnerColumn }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto my-6 not-prose">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-brand-navy text-white">
            {headers.map((header, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left font-semibold ${
                  i === winnerColumn ? 'text-brand-gold' : ''
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 border-b border-gray-100 ${
                    ci === winnerColumn ? 'font-bold text-brand-green' : 'text-gray-700'
                  } ${ci === 0 ? 'font-medium text-gray-900' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
