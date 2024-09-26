import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcrypt'
import * as zod from 'zod'

// schema for form validation
const userSchema = zod
  .object({
    name: zod
      .string()
      .min(1, "Il manque un nom d'utilisateur")
      .max(100),
    email: zod
      .string()
      .min(1, 'Il faut une adresse courriel')
      .email('Adresse couriel invalide'),
    password: zod
      .string()
      .min(1, 'Il manque un mot de passe')
      .min(8, 'Le mot de passe doit avoir au moins 8 caractères'),
    confirmPassword: zod
      .string()
      .min(1, 'Confirmez le mot de passe')
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne sont pas identiques'
  })

export async function POST(request) {
  try {
    const { email, name, password } = userSchema.parse(await request.json())
    // check that email does not already exist
    const emailExists = await db.user.findUnique({
      where: { email }
    })

    if (emailExists) {
      return NextResponse.json({
        user: null,
        msg: 'Il existe déjà un utilisateur avec cette adresse courriel.'
      }, { status: 409 })
    }

    // if no user exists with credentials, create one
    const hashedPassword = await hash(password, 10)
    const newUser = await db.user.create({
      data: { name, email, password: hashedPassword }
    })

    return NextResponse.json({
      user: { ...newUser, password: undefined },
      msg: 'Utilisateur créé!'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ msg: 'Oups! Il y a eu un problème!', error }, { status: 500 })
  }
}
