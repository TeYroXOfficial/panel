import { createTypedHooks } from 'easy-peasy'
import { ApplicationStore } from '@/state'
import { useEffect, useRef, useState } from 'react'
import getStatus, { formatBytes } from '@/api/server/getStatus'

const { useStoreActions, useStoreState } = createTypedHooks<ApplicationStore>()

const useServerState = (id: number) => {
  const server = useStoreState((state) => state.server.data)
  const setServer = useStoreActions((actions) => actions.server.setServer)
  const [isErroring, setIsErroring] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const errorCountRef = useRef(errorCount)

  useEffect(() => {
    errorCountRef.current = errorCount
  }, [errorCount])

  const convertTimeToSmallest = (seconds: number) => {
    const units = [
      [1, 's'],
      [60, 'm'],
      [60 * 60, 'h'],
      [60 * 60 * 24, 'day'],
    ]
    let bestUnit = units[0]
    for (const unit of units) {
      if (seconds >= unit[0]) {
        bestUnit = unit
      }
    }

    return {
      time: seconds / (bestUnit[0] as number),
      unit: bestUnit[1] as string,
    }
  }

  // preflight check to make sure we have the right server
  useEffect(() => {
    if (server && server.id !== id) {
      setServer(undefined)
    }
  }, [])

  const updateServerStatus = async () => {
    try {
      const { data: { status, cpu, mem, maxmem, uptime } } = await getStatus(id)

      const { time, unit } = convertTimeToSmallest(uptime)

      setServer({
        id,
        state: status,
        uptime: {
          time,
          unit,
        },
        cpu: Math.floor(cpu * 10000) / 100,
        mem: formatBytes(mem),
        maxmem: formatBytes(maxmem),
        memUnparsed: {
          mem,
          maxmem,
        },
      })
      setErrorCount(0)
    } catch (e) {
      setServer(undefined)
      setErrorCount((count) => count + 1)

      if (errorCountRef.current > 1) {
        setIsErroring(true)
      }
    }
  }

  return { serverState: server, updateServerStatus, isErroring }
}

export default useServerState
