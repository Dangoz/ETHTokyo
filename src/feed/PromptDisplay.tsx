import React, { useEffect } from 'react'
import Dialog from '@ui/Dialog'

interface PromptDisplayProps {
  prompt: string
  open: boolean
  setOpen: (condition: boolean) => void
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, open, setOpen }) => {
  return (
    <>
      <Dialog open={open} setOpen={setOpen} blur={'sm'}>
        <div className="w-40 h-30 border-2 rounded-md border-slate-400 p-10">{prompt}</div>
      </Dialog>
    </>
  )
}

export default PromptDisplay
