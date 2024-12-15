'use client';

import ReactECharts from 'echarts-for-react';
import { useState } from 'react';

const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    boundaryGap: false, 
  },
  yAxis: {
    type: 'value',
    position: 'right', 
    min: 100,
    max: 1700,
    interval: 200,
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  grid: {
    left: '5%',
    right: '5%',
    top: '10%',
    bottom: '10%',
    containLabel: true, 
  },
  series: [
    {
      data: [210, 180, 380, 900, 540, 1000, 180],
      type: 'line',
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(72, 118, 255, 0.5)' }, 
            { offset: 1, color: 'rgba(72, 245, 255, 0.2)' },
          ],
        },
      },
      lineStyle: {
        color: 'rgba(72, 118, 255, 1)',
        width: 2,
      },
      symbol: 'none',
    },
  ],
};

const chartFilter = [
  { label: 'Today' },
  { label: 'Yesterday' },
  { label: '7 days' },
  { label: '30 days' },
  { label: '60 days' },
  { label: '1 year' },
]

export default function FakeChart() {
  const [activeFilter, setActiveFilter] = useState('7 days')

  return (
    <div className="w-full h-full border rounded-md flex flex-col items-center justify-center p-4">
      <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
      <ul className="flex gap-1">
        {chartFilter.map(filter => (
          <li
            className={`px-3 py-1 border rounded-xl cursor-pointer ${activeFilter === filter.label ? 'bg-green-800 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveFilter(filter.label)}
          >
            {filter.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
