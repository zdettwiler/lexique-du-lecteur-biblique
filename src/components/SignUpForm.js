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

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, "Il manque un nom d'utilisateur")
      .max(100),
    email: z
      .string()
      .min(1, 'Il faut une adresse courriel')
      .email('Adresse couriel invalide'),
    password: z
      .string()
      .min(1, 'Il manque un mot de passe')
      .min(8, 'Le mot de passe doit avoir au moins 8 caractères'),
    confirmPassword: z
      .string()
      .min(1, 'Confirmez le mot de passe')
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne sont pas identiques'
  })

const SignUpForm = () => {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (values) => {
    console.log(values)
    // const signInData = await signIn('credentials', {
    //   email: values.email,
    //   password: values.password
    // })
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: values.email,
        name: values.name,
        password: values.password,
        confirmPassword: values.confirmPassword
      })
    })

    if (response.status === 201) {
      router.push('/sign-in')
      console.log(await response.json())
    }
  }

  return (
    <Form className='mb-4' onSubmit={form.handleSubmit(onSubmit)}>
      <Col xs={7} lg={3} className='mb-3'>
        <Row className='mb-3 align-items-end d-flex justify-content-center'>
          <Form.Label>Nom</Form.Label>
          <Form.Control
            {...form.register('name')}
            type='text'
            aria-label='Nom'
          />
        </Row>

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
          <Form.Label>Confirmez le mot de passe</Form.Label>
          <Form.Control
            {...form.register('confirmPassword')}
            type='password'
            aria-label='Confirmez le mot de passe'
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

export default SignUpForm
