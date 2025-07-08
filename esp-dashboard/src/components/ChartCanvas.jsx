import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ReactSpeedometer from 'react-d3-speedometer';
import { useState } from 'react';

export default function ChartWithMultiSpeedometers({ labels, datasets }) {
  const [view, setView] = useState('chart'); // 'chart' or 'speedometer'
// All visible by default
const [visibleKeys, setVisibleKeys] = useState({
  dx: true,
  dy: true,
  dz: true,
});

  const chartData = labels.map((label, index) => ({
    time: label,
    dx: datasets.x[index],
    dy: datasets.y[index],
    dz: datasets.z[index],
  }));

  const latest = {
    x: datasets.x[datasets.x.length - 1] || 0,
    y: datasets.y[datasets.y.length - 1] || 0,
    z: datasets.z[datasets.z.length - 1] || 0,
  };



  const toggleKey = (key) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const buttonStyle = (key) =>
    `text-sm font-medium px-4 py-2 rounded-lg transition ${
      visibleKeys[key]
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    }`;


  return (
    <div className="w-full">
      {/* View Toggle */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setView('chart')}
          className={`px-4 py-2 rounded-md border ${
            view === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          } shadow-sm`}
        >
          📊 Live Graph
        </button>
        <button
          onClick={() => setView('speedometer')}
          className={`px-4 py-2 rounded-md border ${
            view === 'speedometer' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          } shadow-sm`}
        >
          🧭 Compass Mode
        </button>
      </div>

      {/* Line Chart */}
      {view === 'chart' && (
        <div className="scroll-wrapper overflow-x-auto w-full">
          <div className="flex justify-center gap-4 mb-4">
            <button onClick={() => toggleKey('dx')} className={buttonStyle('dx')}>
              X
            </button>
            <button onClick={() => toggleKey('dy')} className={buttonStyle('dy')}>
              Y
            </button>
            <button onClick={() => toggleKey('dz')} className={buttonStyle('dz')}>
              Z
            </button>
          </div>

          <div className="min-w-[700px] h-[400px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, bottom: 20, left: 10 }}
              >
                <defs>
                  <linearGradient id="colorDx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.2)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#555' }}
                  angle={-30}
                  textAnchor="end"
                  interval="preserveStartEnd"
                  label={{
                    value: 'Time',
                    position: 'insideBottom',
                    offset: -10,
                    fill: '#111',
                    fontSize: 14,
                  }}
                />
                <YAxis
                  domain={[-180, 180]}
                  tick={{ fill: '#555' }}
                  tickCount={13}
                  label={{
                    value: 'Angle (°)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#111',
                    fontSize: 14,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderRadius: '6px',
                    color: '#d1d5db',
                  }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Legend verticalAlign="top" />

                {visibleKeys.dx && (
                  <Area
                    type="monotone"
                    dataKey="dx"
                    name="ΔX"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorDx)"
                  />
                )}
                {visibleKeys.dy && (
                  <Area
                    type="monotone"
                    dataKey="dy"
                    name="ΔY"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#colorDy)"
                  />
                )}
                {visibleKeys.dz && (
                  <Area
                    type="monotone"
                    dataKey="dz"
                    name="ΔZ"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorDz)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Multi Speedometers */}
      {view === 'speedometer' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <ReactSpeedometer
              minValue={-180}
              maxValue={180}
              value={latest.x}
              segments={10}
              currentValueText="ΔX: ${value}°"
              needleColor="#ef4444"
              startColor="#fde68a"
              endColor="#ef4444"
              textColor="#111"
              height={250}
              ringWidth={30}
            />
          </div>
          <div className="flex justify-center items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <ReactSpeedometer
              minValue={-180}
              maxValue={180}
              value={latest.y}
              segments={10}
              currentValueText="ΔY: ${value}°"
              needleColor="#22c55e"
              startColor="#bbf7d0"
              endColor="#22c55e"
              textColor="#111"
              height={250}
              ringWidth={30}
            />
          </div>
          <div className="flex justify-center items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <ReactSpeedometer
              minValue={-180}
              maxValue={180}
              value={latest.z}
              segments={10}
              currentValueText="ΔZ: ${value}°"
              needleColor="#3b82f6"
              startColor="#bfdbfe"
              endColor="#3b82f6"
              textColor="#111"
              height={250}
              ringWidth={30}
            />
          </div>
        </div>
      )}
    </div>
  );
}
