import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RiskScore } from '../types';

interface Props {
  risk: RiskScore;
}

const RiskGauge: React.FC<Props> = ({ risk }) => {
  const data = [
    { name: 'Score', value: risk.score },
    { name: 'Remaining', value: 100 - risk.score },
  ];

  const getColor = (score: number) => {
    if (score < 30) return '#10b981'; // Green
    if (score < 70) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const color = getColor(risk.score);

  return (
    <div className="relative h-40 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e2e8f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 text-center">
         <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Risk Score</p>
         <p className="text-4xl font-bold" style={{ color }}>{risk.score}</p>
      </div>
    </div>
  );
};

export default RiskGauge;