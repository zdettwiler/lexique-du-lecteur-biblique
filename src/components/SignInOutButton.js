import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import UserAccountNav from '@/components/UserAccountNav'

export default async function SignInOutButton () {
  const session = await getServerSession(authOptions)

  return (
    <>
      {session?.user
        ? <UserAccountNav />
        : (<Link className='btn btn-outline-dark btn-sm' href='/sign-in'>Connexion</Link>)}
    </>
  )
}
