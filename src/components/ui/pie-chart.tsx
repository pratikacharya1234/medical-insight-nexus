
"use client"

import * as React from "react"
import { PieChart as Pie, Pie as PieSection, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "./chart"

interface PieChartProps {
  data: {
    name: string
    value: number
  }[]
}

export function PieChart({ data }: PieChartProps) {
  // A palette of colors to use for the pie slices
  const COLORS = ['#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef', '#ade8f4'];

  return (
    <ChartContainer
      config={
        Object.fromEntries(
          data.map((item, i) => [
            item.name,
            { 
              color: COLORS[i % COLORS.length], 
              label: item.name 
            },
          ])
        )
      }
    >
      <Pie>
        <PieSection
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              name={entry.name}
            />
          ))}
        </PieSection>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Legend content={<ChartLegendContent nameKey="name" />} />
      </Pie>
    </ChartContainer>
  )
}
