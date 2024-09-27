'use client'

import { Button } from 'react-bootstrap'
import { signOut } from 'next-auth/react'

export default function UserAccountNav () {
  return (
    <Button
      onClick={() => signOut({
        redirect: true,
        callbackUrl: '/sign-in'
      })} variant='outline-dark' size='sm' className='mr-4'
    >
      Déconnexion
    </Button>
  )
}
