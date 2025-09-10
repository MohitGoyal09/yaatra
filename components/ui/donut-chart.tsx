import * as React from "react";

type Slice = { label: string; value: number; color: string };

export function DonutChart({
  size = 140,
  stroke = 16,
  slices,
}: {
  size?: number;
  stroke?: number;
  slices: Slice[];
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;

  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {slices.map((slice, idx) => {
            const length = (slice.value / total) * circumference;
            const circle = (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={stroke}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += length;
            return circle;
          })}
        </g>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - stroke / 2}
          fill="white"
        />
      </svg>
      <div className="space-y-1 text-sm">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded"
              style={{ background: s.color }}
            />
            <span>{s.label}</span>
            <span className="text-muted-foreground">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
