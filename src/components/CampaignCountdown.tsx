import { useMemo } from 'react'
import { CAMPAIGN_END, CAMPAIGN_START, CAMPAIGN_TOTAL_DAYS } from '../lib/constants'
import { gradientText } from './ui'

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
  const numberClass = size === 'lg' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-brand-soft border border-white/[0.08] rounded-xl p-5 text-center">
          <div className={`${numberClass} font-extrabold leading-none ${gradientText}`}>
            {dayNumber}
            <span className="text-base font-semibold text-white/40"> / {CAMPAIGN_TOTAL_DAYS}</span>
          </div>
          <div className="text-[0.7rem] uppercase tracking-wider text-white/50 mt-2">
            Giorno della challenge
          </div>
        </div>
        <div className="bg-brand-soft border border-white/[0.08] rounded-xl p-5 text-center">
          <div className={`${numberClass} font-extrabold leading-none ${gradientText}`}>
            {daysRemaining}
          </div>
          <div className="text-[0.7rem] uppercase tracking-wider text-white/50 mt-2">
            Giorni al 21 luglio 2030
          </div>
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-brand-soft border border-white/[0.08] overflow-hidden mt-5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-yellow to-brand-red transition-[width] duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
