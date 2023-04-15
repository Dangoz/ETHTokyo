import Image from 'next/image'
import { Inter } from 'next/font/google'
import HomeContainer from '@/components/home/HomeContainer'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <HomeContainer />
    </>
  )
}
