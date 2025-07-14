import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes"
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FeedbackFormProvider from "@/components/CorrectionFormProvider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: 'Lexique du lecteur biblique',
  description: 'Créez un lexique pour le livre que vous souhaitez étudier avec les mots dont vous avez besoin.',
  background_color: 'white',
  theme_color: 'black',
  display: 'standalone',
  // icons: [
  //   {
  //     rel: 'icon',
  //     type: 'image/png',
  //     media: '(prefers-color-scheme: light)',
  //     url: '/favicon-light.png'
  //   },
  //   {
  //     rel: 'icon',
  //     type: 'image/png',
  //     media: '(prefers-color-scheme: dark)',
  //     url: '/favicon-dark.png'
  //   },
  //   {
  //     src: '/img/icon-192.png',
  //     sizes: '192x192',
  //     type: 'image/png'
  //   },
  //   {
  //     src: '/img/icon-512.png',
  //     sizes: '512x512',
  //     type: 'image/png'
  //   }
  // ]
}

export const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FeedbackFormProvider>
            <Nav />
            {children}
            <Footer />
          </FeedbackFormProvider>
          <Toaster richColors/>
        </ThemeProvider>
      </body>
    </html>
  );
}
