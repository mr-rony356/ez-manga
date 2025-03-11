'use client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { PAYPAL_CLIENT_ID } from '@global'
import { env } from '@/env'

export default function PaypalProvider({
  children,
  intent,
}: {
  children: React.ReactNode
  intent: string
}) {
  if (env.NEXT_PUBLIC_USE_PAYPAL === false) return <>{children}</>

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        vault: true,
        intent,
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}
