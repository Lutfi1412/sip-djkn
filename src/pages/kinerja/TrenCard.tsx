import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip, type TipProps } from '../../components/charts/ChartTooltip'
import type { KinerjaData } from '../../data/kinerjaData'
import { fmtNum } from '../../lib/format'
import { Card } from './Card'

const MARGIN = { top: 14, right: 14, left: 0, bottom: 0 }
const AXIS = { fontSize: 10, fill: '#62738a' }

export function TrenCard({ data }: { data: KinerjaData }) {
  return (
    <Card title="Tren nilai hasil penilaian" subtitle={`Jan–Des ${data.tahun} · Nilai dalam Miliar`}>
      <p className="mb-1 text-[11px] font-semibold text-c-blue">Nilai penilaian</p>
      <div className="h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.tren} margin={MARGIN} syncId="tren">
            <defs>
              <linearGradient id="gradNilai" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#215db8" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#215db8" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e4ebf5" />
            <XAxis dataKey="bulan" hide />
            <YAxis
              domain={[0, 120]}
              ticks={[0, 40, 80, 120]}
              width={34}
              tickLine={false}
              axisLine={false}
              tick={AXIS}
            />
            <Tooltip
              cursor={{ stroke: '#215db8', strokeDasharray: '3 3', strokeOpacity: 0.5 }}
              content={(p) => (
                <ChartTooltip
                  {...(p as unknown as TipProps)}
                  rows={(e) =>
                    e.dataKey === 'nilai'
                      ? { name: 'Nilai penilaian', value: `Rp ${fmtNum(Number(e.value), 2)} M`, color: '#215db8' }
                      : null
                  }
                />
              )}
            />
            <Area
              type="linear"
              dataKey="nilai"
              stroke="#215db8"
              strokeWidth={2}
              fill="url(#gradNilai)"
              dot={{ r: 2.5, fill: '#215db8', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#fff', stroke: '#215db8', strokeWidth: 2 }}
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mb-1 mt-2 text-[11px] font-semibold text-c-teal">Jumlah laporan</p>
      <div className="h-[104px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.tren} margin={{ ...MARGIN, top: 16 }} syncId="tren">
            <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={AXIS} interval={0} />
            <YAxis hide domain={[0, 3]} width={34} />
            <Tooltip
              cursor={{ fill: '#9adcd2', fillOpacity: 0.18 }}
              content={(p) => (
                <ChartTooltip
                  {...(p as unknown as TipProps)}
                  rows={(e) =>
                    e.dataKey === 'laporan'
                      ? { name: 'Jumlah laporan', value: String(e.value), color: '#07837b' }
                      : null
                  }
                />
              )}
            />
            <Bar dataKey="laporan" fill="#9adcd2" radius={[4, 4, 4, 4]} maxBarSize={26} animationDuration={900}>
              <LabelList dataKey="laporan" position="top" fontSize={10} fontWeight={600} fill="#172b46" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
