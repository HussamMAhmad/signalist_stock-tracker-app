import React from 'react'
import { Button } from "@/components/ui/button";
import Headers from '@/components/Header';

export const Home = () => {
  return (
    <main className="min-h-screen text-grey-400"> 
    <Headers/>
    <div className='flex items-center justify-center h-screen'>
      Home
    </div>
    </main>
  )
}

export default Home;
