'use server'
import { cookies } from 'next/headers';

export async function actionToggleDarkMode(value) {
  const cookieStore = cookies();
  cookieStore.set('isDarkMode', value);
};
