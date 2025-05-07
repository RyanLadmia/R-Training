/*Header*/
'use client'

import { useAuth } from '@/contexts/authContext'
import { Button } from '@/components/ui/button'
import { Flag, LogOut } from 'lucide-react'

export default function Header() {
  const { isAuthenticated, logout: authLogout } = useAuth()
  
  const handleLogout = () => {
    authLogout()
    window.location = "/"
  }

  return (
    <div className='bg-blue-950 fixed top-0 w-full text-white h-[60px] flex items-center px-2 justify-between '>
      <div>
        <a href='/' className='flex items-center gap-2'>
          Accueil
        </a>
      </div>
      {
        isAuthenticated ?   
        <Button className="bg-white text-black hover:bg-gray-200 px-2 py-2 flex" onClick={handleLogout}>
          Déconnexion
        </Button> :
        <div className='flex item-center gap-2 '>
          <a className="bg-white text-black hover:bg-gray-200 px-2 py-2" href='/auth/login'>
            Connexion
          </a>
        </div>
      }
    </div>
  )
}

