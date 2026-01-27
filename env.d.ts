declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      NEXT_PUBLIC_URL: string
      NEXT_PUBLIC_GTM_ID: string
      GOOGLESHEETS_FEEDBACK: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
