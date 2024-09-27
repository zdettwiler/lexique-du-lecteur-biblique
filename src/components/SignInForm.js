'use client'
import { signIn } from 'next-auth/react'
import {
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

const signInSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Entrez votre adresse courriel')
      .email('Adresse couriel invalide'),
    password: z
      .string()
      .min(1, 'Entrez votre mot de passe')
  })

const SignInForm = () => {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values) => {
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false
    })

    if (signInData.error) {
      console.log(signInData.error)
    } else {
      router.push('/apprendre')
      router.refresh()
    }
  }

  return (

    <Form className='mb-4' onSubmit={form.handleSubmit(onSubmit)}>
      <Col xs={7} lg={3} className='mb-3'>
        <Row className='mb-3 align-items-end d-flex justify-content-center'>
          <Form.Label>Adresse courriel</Form.Label>
          <Form.Control
            {...form.register('email')}
            type='email'
            aria-label='Adresse courriel'
          />
        </Row>

        <Row className='mb-3 align-items-end d-flex justify-content-center'>
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            {...form.register('password')}
            type='password'
            aria-label='Mot de passe'
          />
        </Row>

        <Row className='mb-3 align-items-end d-flex justify-content-center'>
          <Button variant='dark' type='submit'>
            Se connecter
          </Button>
        </Row>
      </Col>
    </Form>
  )
}

export default SignInForm
