
"use client"

import * as React from "react"
import { BarChart as Bars, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"

interface BarChartProps {
  data: {
    name: string
    value: number
  }[]
}

export function BarChart({ data }: BarChartProps) {
  return (
    <ChartContainer
      config={{
        value: {},
      }}
    >
      <Bars data={data} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0077b6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0077b6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          dy={10}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          width={30}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="value"
          fill="url(#colorValue)"
          radius={[4, 4, 0, 0]}
          barSize={40}
          animationDuration={1000}
        />
      </Bars>
    </ChartContainer>
  )
}
