import { useState, type ReactNode } from 'react'
import { PrevNext } from '../../components/ui/Pagination'
import { Card } from './Card'

export interface Column<T> {
  head: string
  cell: (row: T) => ReactNode
  align?: 'left' | 'center' | 'right'
  strong?: boolean
}

interface Props<T> {
  title: string
  rows: T[]
  columns: Column<T>[]
  pageSize?: number
  minWidth?: number
  className?: string
}

const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' }

/** Tabel dengan pagination Sebelumnya/Selanjutnya, gaya kartu Kinerja */
export function PagedTable<T>({ title, rows, columns, pageSize = 5, minWidth = 720, className }: Props<T>) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * pageSize
  const visible = rows.slice(start, start + pageSize)

  return (
    <Card title={title} className={className}>
      <div className="thin-scroll overflow-x-auto rounded-lg">
        <table className="w-full border-collapse text-left text-[11px]" style={{ minWidth }}>
          <thead>
            <tr className="bg-thead text-panel-muted">
              {columns.map((c) => (
                <th key={c.head} scope="col" className={`whitespace-nowrap px-2.5 py-2.5 font-medium ${ALIGN[c.align ?? 'left']}`}>
                  {c.head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-xs text-panel-muted">
                  Tidak ada data untuk filter ini.
                </td>
              </tr>
            ) : (
              visible.map((row, i) => (
                <tr key={start + i} className={`text-ink transition-colors hover:bg-soft ${i % 2 ? 'bg-row' : 'bg-white'}`}>
                  {columns.map((c) => (
                    <td
                      key={c.head}
                      className={`whitespace-nowrap px-2.5 py-2.5 ${ALIGN[c.align ?? 'left']} ${c.strong ? 'font-bold' : ''}`}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-link">
          Menampilkan {visible.length} data dari {rows.length} data
        </p>
        <PrevNext page={current} pageCount={pageCount} onChange={setPage} />
      </div>
    </Card>
  )
}
