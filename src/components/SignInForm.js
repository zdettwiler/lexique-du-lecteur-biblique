'use client'
// import { signIn } from 'next-auth/react'
import {
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const signInSchema = z
  .object({
    username: z
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

const SignInForm = () => {
  const form = useForm()

  const onSubmit = async (values) => {
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password
    })
    console.log('form submit', values)
  }

  return (
    <Form className="mb-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Col xs={7} lg={3} className="mb-3" >
        <Row className="mb-3 align-items-end d-flex justify-content-center">
          <Form.Label>Adresse courriel</Form.Label>
          <Form.Control
            {...form.register("email")}
            type="email"
            aria-label="Adresse courriel"
          ></Form.Control>
        </Row>

        <Row className="mb-3 align-items-end d-flex justify-content-center">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            {...form.register("password")}
            type="password"
            aria-label="Mot de passe"
          ></Form.Control>
        </Row>

        <Row className="mb-3 align-items-end d-flex justify-content-center">
          <Button variant="dark" type="submit">
            Se connecter
          </Button>
        </Row>
      </Col>
    </Form>
  )
}

export default SignInForm
