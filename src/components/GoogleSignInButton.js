import { signIn } from 'next-auth/react'
import {
  Button,
  Spinner
} from 'react-bootstrap'
import React from 'react'

const GoogleSignInButton = () => {
  const [isLoading, setIsLoading] = React.useState(false)

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      await signIn('google', { callbackUrl: 'http://localhost:3000/apprendre' })
    } catch (err) {
      setIsLoading(false)
    } finally {
      // setIsLoading(false)
    }
  }

  return (
    <Button disabled={isLoading} onClick={signInWithGoogle} variant='dark' type='submit'>
      {isLoading && (
        <Spinner
          as='span'
          animation='border'
          size='sm'
          role='status'
          aria-hidden='true'
        />)}
      Se connecter avec Google
    </Button>
  )
}

export default GoogleSignInButton
