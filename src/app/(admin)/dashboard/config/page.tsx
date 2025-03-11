import { Website_Local_API, Website_Name, Website_URL } from '@global'
import EnvForm from './components/EnvForm'
import { Metadata } from 'next'
import { get_cookies } from '@/services/server'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import BackendEnvForm from '@/app/(admin)/dashboard/config/components/BackendEnvForm'
import AssetsForm from '@/app/(admin)/dashboard/config/components/AssetsForm'
import ThemeForm from './components/theme-form'
import { env } from '@/env'

export const metadata: Metadata = {
  title: 'Config - ' + Website_Name,
}
export const dynamic = 'force-dynamic'

export default async function ConfigPage() {
  const cookies = get_cookies()
  const frontend_env = await await fetch(
    env.NEXT_PUBLIC_WEBSITE_URL + '/api/website',
    {
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Cookie: cookies,
      },
    }
  )

  console.log(frontend_env)

  const res: Record<string, string> = await frontend_env.json()
  const backend_env: Record<string, string> = await (
    await fetch(env.NEXT_PUBLIC_API_URL + '/v2/config', {
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Cookie: cookies,
      },
    })
  ).json()

  console.log(backend_env)

  return (
    <div className="container flex flex-col gap-2 min-h-screen">
      <Alert>
        <AlertTitle>Be careful!</AlertTitle>
        <AlertDescription>
          All changes in this page will be reflected on the website! When a
          value changes, the website starts a rebuild.
        </AlertDescription>
      </Alert>
      <ThemeForm />
      <AssetsForm />
      <EnvForm env={res} />
      <BackendEnvForm env={backend_env} />
    </div>
  )
}
