// components/pros-cons.tsx
interface ProsConsProps {
  pros: string[]
  cons: string[]
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <h4 className="font-bold text-emerald-800 mb-3">Pros</h4>
        <ul className="space-y-1.5">
          {pros.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-emerald-600 mt-0.5 flex-shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-bold text-red-800 mb-3">Cons</h4>
        <ul className="space-y-1.5">
          {cons.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
