import React, { createContext, useEffect, useState } from 'react'

export type SearchContext = {
  input: string
  setInput: (input: string) => void
  preferences?: string[]
}

const searchInitialStates: SearchContext = {
  input: '',
  setInput: () => {},
}

export const searchContext = createContext<SearchContext>(searchInitialStates)

export const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [input, setInput] = useState('')

  useEffect(() => {
    console.log('input has been updated to:', input)
  }, [input])

  return <searchContext.Provider value={{ input, setInput }}>{children}</searchContext.Provider>
}
