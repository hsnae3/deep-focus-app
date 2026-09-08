'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Generates soft brown noise with the Web Audio API so no audio asset is needed.
 * Brown noise is produced by integrating white noise, which yields the
 * low-rumble "ambient" texture that works well for focus.
 */
export function useFocusSound() {
  const [enabled, setEnabled] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  const stop = useCallback(() => {
    const ctx = ctxRef.current
    const gain = gainRef.current
    if (!ctx || !gain) return
    gain.gain.setTargetAtTime(0, ctx.currentTime, 0.3)
    window.setTimeout(() => {
      ctx.close().catch(() => {})
      ctxRef.current = null
      gainRef.current = null
    }, 800)
  }, [])

  const start = useCallback(() => {
    if (ctxRef.current) return
    const ctx = new AudioContext()
    const seconds = 4
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 600

    const gain = ctx.createGain()
    gain.gain.value = 0
    gain.gain.setTargetAtTime(0.35, ctx.currentTime, 0.6)

    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start()

    ctxRef.current = ctx
    gainRef.current = gain
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      if (prev) stop()
      else start()
      return !prev
    })
  }, [start, stop])

  useEffect(() => stop, [stop])

  return { enabled, toggle }
}
