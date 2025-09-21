"use client";
import { Plus_Jakarta_Sans } from 'next/font/google'
import { usePathname } from 'next/navigation'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  const isHomePage = pathname === '/'

  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: "head",
            nonce: undefined,
          }}
        >
          {!isLoginPage && <Navbar backgroundType={isHomePage ? 'glass' : 'white'} />}
          <main>
            {children}
          </main>
          {!isLoginPage && <Footer />}
        </GoogleReCaptchaProvider>
      </body>
    </html>
  )
}
