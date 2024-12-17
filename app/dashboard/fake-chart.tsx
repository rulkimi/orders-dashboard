'use client';

import ReactECharts from 'echarts-for-react';
import { useState } from 'react';

type ChartData = {
  [key: string]: {
    data: number[];
    xAxis: string[];
  };
};

const chartData: ChartData = {
  'Today': {
    data: [210],
    xAxis: ['Mon'],
  },
  'Yesterday': {
    data: [100, 220, 320, 450, 500, 900, 120],
    xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  '7 days': {
    data: [210, 180, 380, 900, 540, 1000, 180],
    xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  '30 days': {
    data: [300, 400, 500, 600, 800, 1000, 1300],
    xAxis: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
  },
  '60 days': {
    data: [150, 200, 250, 300, 400, 500, 600],
    xAxis: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
  },
  '1 year': {
    data: [500, 600, 700, 800, 900, 1000, 1100],
    xAxis: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7'],
  },
};

const initialOption = {
  xAxis: {
    type: 'category',
    data: chartData['7 days'].xAxis, 
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
      data: chartData['7 days'].data,
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

export default function FakeChart() {
  const [activeFilter, setActiveFilter] = useState<string>('7 days');
  const [option, setOption] = useState(initialOption);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    const selectedData = chartData[filter];

    setOption({
      ...initialOption,
      xAxis: {
        ...initialOption.xAxis,
        data: selectedData.xAxis,
      },
      series: [
        {
          ...initialOption.series[0],
          data: selectedData.data, 
        },
      ],
    });
  };

  return (
    <div className="w-full h-full border rounded-2xl flex flex-col items-center justify-center p-4">
      <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
      <ul className="flex gap-1">
        {Object.keys(chartData).map((filter) => (
          <li
            key={filter}
            className={`px-3 py-1 border rounded-xl cursor-pointer ${activeFilter === filter ? 'bg-green-800 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </li>
        ))}
      </ul>
    </div>
  );
}
