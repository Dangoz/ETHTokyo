import React from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'

interface ToolTipProps {
  children: React.ReactNode
  message: string
  delayDuration?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const ToolTip: React.FC<ToolTipProps> = ({ children, message = 'Tooltip', delayDuration = 500, side = 'top' }) => {
  return (
    <Tooltip.Provider delayDuration={delayDuration}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side={side} className="bg-bgGrey text-white/80 rounded-md px-2 py-1">
            {message}
            <Tooltip.Arrow
              className={clsx(
                'fill-bgGrey',
                side === 'top' && 'mb-1',
                side === 'right' && 'ml-1',
                side === 'bottom' && 'mt-1',
                side === 'left' && 'mr-1',
              )}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export default ToolTip
