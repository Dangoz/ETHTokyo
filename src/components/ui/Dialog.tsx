import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { Cross2Icon } from '@radix-ui/react-icons'

interface DialogProps {
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  blur?: 'sm' | 'md' | 'lg' | undefined
  close?: boolean
}

const Modal: React.FC<DialogProps> = ({ children, open, setOpen, blur = undefined, close = false }) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay
          className={clsx(
            'fixed inset-0 bg-black bg-opacity-50 transition-opacity z-[9999]',
            'flex justify-center items-center',
            blur === 'sm' && 'backdrop-blur-sm',
            blur === 'md' && 'backdrop-blur-md',
            blur === 'lg' && 'backdrop-blur-lg',
          )}
        >
          <Dialog.Content>
            {children}
            <Dialog.Title />
            <Dialog.Description />
            {close && (
              <Dialog.Close className="absolute top-0 right-0 m-14 p-2">
                <Cross2Icon className="w-6 h-6" />
              </Dialog.Close>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal
