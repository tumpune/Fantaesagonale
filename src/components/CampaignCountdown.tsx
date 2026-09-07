import { useMemo } from 'react'
import { CAMPAIGN_END, CAMPAIGN_START, CAMPAIGN_TOTAL_DAYS } from '../lib/constants'
import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'
import { gradientText } from './ui/styles'

const ONE_DAY = 24 * 60 * 60 * 1000

export function useCampaignProgress() {
  return useMemo(() => {
    const now = Date.now()
    const dayNumber = Math.min(
      CAMPAIGN_TOTAL_DAYS,
      Math.max(1, Math.floor((now - CAMPAIGN_START.getTime()) / ONE_DAY) + 1),
    )
    const daysRemaining = Math.max(0, Math.ceil((CAMPAIGN_END.getTime() - now) / ONE_DAY))
    const progress = Math.min(100, Math.max(0, (dayNumber / CAMPAIGN_TOTAL_DAYS) * 100))
    return { dayNumber, daysRemaining, progress }
  }, [])
}

export default function CampaignCountdown({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const { dayNumber, daysRemaining, progress } = useCampaignProgress()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 })

  // I numeri salgono da zero quando il riquadro entra in vista: fermi
  // sarebbero solo due cifre, cosi' si legge il passare del tempo.
  const animatedDay = useCountUp(dayNumber, inView)
  const animatedRemaining = useCountUp(daysRemaining, inView, 1700)

  const numberClass = size === 'lg' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'

  return (
    <div ref={ref}>
      <div className="grid grid-cols-2 gap-4">
        <div className="card-hover rounded-xl border border-white/[0.08] bg-brand-soft p-5 text-center">
          <div className={`${numberClass} font-extrabold leading-none ${gradientText}`}>
            {animatedDay}
            <span className="text-base font-semibold text-white/40"> / {CAMPAIGN_TOTAL_DAYS}</span>
          </div>
          <div className="mt-2 text-xs uppercase tracking-wider text-white/50">
            Giorno della challenge
          </div>
        </div>
        <div className="card-hover rounded-xl border border-white/[0.08] bg-brand-soft p-5 text-center">
          <div className={`${numberClass} font-extrabold leading-none ${gradientText}`}>
            {animatedRemaining}
          </div>
          <div className="mt-2 text-xs uppercase tracking-wider text-white/50">
            Giorni al 21 luglio 2030
          </div>
        </div>
      </div>
      <div className="mt-5 h-2.5 overflow-hidden rounded-full border border-white/[0.08] bg-brand-soft">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-yellow to-brand-red transition-[width] duration-[1600ms] ease-out"
          style={{ width: inView ? `${progress}%` : '0%' }}
        />
      </div>
    </div>
  )
}
