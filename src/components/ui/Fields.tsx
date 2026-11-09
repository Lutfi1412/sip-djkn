import { CalendarDays, ChevronDown } from 'lucide-react'
import { useId, type ReactNode } from 'react'

const control =
  'h-11 w-full rounded-lg border border-line-strong bg-white px-3 text-sm text-ink transition-colors hover:border-brand/60 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/25'

export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-ink">
      {children}
    </label>
  )
}

interface SelectProps {
  label?: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  /** teks saat belum ada pilihan (value kosong) */
  placeholder?: string
  compact?: boolean
  className?: string
}

export function SelectField({ label, value, onChange, options, placeholder, compact, className = '' }: SelectProps) {
  const id = useId()
  return (
    <div className={className}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${control} ${compact ? 'h-9 pr-8' : 'pr-10'} cursor-pointer appearance-none ${value === '' ? 'text-muted' : ''}`}
        >
          {placeholder !== undefined && (
            <option value="" className="text-muted">
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink"
        />
      </div>
    </div>
  )
}

interface DateProps {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  min?: string
  max?: string
  invalid?: boolean
  compact?: boolean
  className?: string
}

export function DateField({ label, value, onChange, placeholder, min, max, invalid, compact, className = '' }: DateProps) {
  const id = useId()
  return (
    <div className={className}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <div className="relative">
        <input
          id={id}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
          className={`date-input peer ${control} ${compact ? 'px-2.5 pr-8 text-[13px]' : 'pr-10'} ${value ? '' : 'text-transparent focus:text-ink'} ${
            invalid ? 'border-bad focus:border-bad focus:ring-bad/20' : ''
          }`}
        />
        {!value && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted peer-focus:hidden">
            {placeholder}
          </span>
        )}
        <CalendarDays aria-hidden className={`pointer-events-none absolute top-1/2 size-4 ${compact ? 'right-2.5' : 'right-3'} -translate-y-1/2 text-ink`} />
      </div>
    </div>
  )
}
