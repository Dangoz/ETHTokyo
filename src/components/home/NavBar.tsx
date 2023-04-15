import React from 'react'
import SearchTrigger from './SearchTrigger'
import ConnectionStatus from './ConnectionStatus'

const NavBar = () => {
  return (
    <div className=" h-16 flex items-center justify-between px-8">
      <SearchTrigger />

      <ConnectionStatus />
    </div>
  )
}

export default NavBar
