
"use client"

import * as React from "react"
import { LineChart as Lines, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"

interface LineChartProps {
  data: {
    name: string
    value: number
  }[]
}

export function LineChart({ data }: LineChartProps) {
  return (
    <ChartContainer
      config={{
        value: {},
      }}
    >
      <Lines data={data} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0077b6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0077b6" stopOpacity={0} />
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
        <Line
          type="monotone"
          dataKey="value"
          stroke="#0077b6"
          strokeWidth={2}
          dot={{ r: 4, fill: "#0077b6", strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6, fill: "#0077b6", strokeWidth: 2, stroke: "#fff" }}
          animationDuration={1000}
        />
      </Lines>
    </ChartContainer>
  )
}
