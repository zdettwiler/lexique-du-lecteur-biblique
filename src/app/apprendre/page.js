import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function ApprendrePage () {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return <h1>Bienvenue, {session?.user.name}!</h1>
  }

  return (<h2>You're not connected</h2>)
}
