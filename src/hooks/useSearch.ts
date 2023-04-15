import { useContext } from 'react'
import { searchContext } from '@/store/searchContext'
import type { SearchContext as SearchContextType } from '@/store/searchContext'

const useSearch = (): SearchContextType => {
  const context = useContext(searchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within SearchContextProvider')
  }
  return context
}

export default useSearch
