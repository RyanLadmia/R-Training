/*Header*/
'use client'

import { Button } from '@/components/ui/button'
import { Flag, LogOut } from 'lucide-react'

export default function Header() {
  const token = localStorage.getItem("accessToken")
  
  function logout(){

      localStorage.clear()
      window.location="/"
      
  
  }

  return (
    <div className='bg-blue-950 fixed top-0 w-full text-white h-[60px] flex items-center px-2 justify-between '>
      <div  >
        <a href='/' className='flex items-center gap-2'>
        Accueil
        </a>
      </div>
      {
        token != null ?   
        <Button className="bg-white text-black hover:bg-gray-200 px-2 py-2 flex" onClick={()=>{
          logout()
        }}>
          <LogOut />
        Deconnexion
      </Button>:
        <div className='flex item-center gap-2 '>
          <a className="bg-white text-black hover:bg-gray-200 px-2 py-2" href='/auth/login' >
            Connexion
          </a>
        </div>
      }
    </div>
  )
}

