// components/score-breakdown.tsx
import { ScoreDimension } from '@/lib/types'

interface ScoreBreakdownProps {
  topPick: string
  dimensions: ScoreDimension[]
}

export function ScoreBreakdown({ topPick, dimensions }: ScoreBreakdownProps) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 my-6 not-prose">
      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">⭐ Top Pick</p>
      <p className="font-bold text-gray-900 text-base mb-4">{topPick}</p>
      <div className="space-y-2">
        {dimensions.map(({ label, score }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-brand-green h-1.5 rounded-full"
                  style={{ width: `${(score / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 w-6 text-right">{score.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
