import React, { useState, useEffect } from 'react'
import Dialog from '@ui/Dialog'
import useSearch from '@/hooks/useSearch'
import Textarea from '../ui/TextArea'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Button } from '@ui/Button'

interface SearchBarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ open, setOpen }) => {
  const [currentText, setCurrentText] = useState('')
  const { setInput } = useSearch()

  const handleSearch = () => {
    setInput(currentText)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) setCurrentText('')
  }, [open])

  return (
    <>
      <Dialog open={open} setOpen={setOpen} blur={'md'}>
        <form onSubmit={handleSearch} className="flex flex-col justify-center items-center gap-3">
          <Textarea
            className="h-20 min-w-[350px]"
            placeholder={'Describe what you are looking for...'}
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
          />
          <div className="flex justify-end items-center w-full">
            <Button disabled={currentText.trim() === ''} variant={'outline'} type="submit">
              <MagnifyingGlassIcon className="w-5 h-5 text-white mr-2" />
              Search
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default SearchBar
