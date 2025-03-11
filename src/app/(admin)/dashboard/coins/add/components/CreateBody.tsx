'use client'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import API from '@/services/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import z from 'zod'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CreateProductBodyForm from './create-product-body'
import { Form } from '@/components/ui/form'
import { Series } from '@/types'
import { useHydrateAtoms } from 'jotai/utils'

import Breadcrumb from '@/components/breadcrumb'
import { atom } from 'jotai'

// export const metadata: Metadata = {
//   title: 'Add product - ' + Website_Name,
// }

export const seriesAtom = atom<Series[]>([])

const createProductFormSchema = z.object({
  name: z.string().min(6),
  description: z.string().min(6),
  price: z.string().refine((value) => typeof parseInt(value) == 'number', {
    message: 'Must be a number',
  }),
  is_subscription_product: z.boolean(),
  currency_code: z.string(),
  status: z.string(),
  coins_reward: z
    .string()
    .refine((value) => typeof parseInt(value) == 'number', {
      message: 'Must be a number',
    }),
  plan: z
    .object({
      name: z.string(),
      description: z.string(),
      status: z.enum(['ACTIVE', 'INACTIVE', 'CREATED']),
      interval_unit: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
      series_ids: z.array(z.number()),
    })
    .optional().nullable(),
})

export type CreateProductFormValues = z.infer<typeof createProductFormSchema>

const ProductCreateBody = ({ series }: { series: Series[] }) => {
  useHydrateAtoms([[seriesAtom, series]] as const)
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      is_subscription_product: false,
      currency_code: 'USD',
      status: 'ACTIVE',
      coins_reward: '0',
    },
  })
  const router = useRouter()

  const formRef = useRef<HTMLFormElement>(null)

  const createProduct = async (data: CreateProductFormValues) => {
    const { plan, ...payload } = data
    toast.promise(
      API.post('/v2/products', {
        ...payload,
        ...(payload.is_subscription_product && { plan }),
      }),
      {
        loading: 'Creating coins package...',
        error: 'Failed to create product',
        success: () => {
          setTimeout(() => router.push('/dashboard/coins'), 1000)
          return 'Product created successfully'
        },
      }
    )
  }

  function triggerSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    if (!formRef.current) return
    formRef.current.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    )
  }

  return (
    <div className="container grid grid-cols-12 gap-2">
      <div className="col-span-12 py-4">
        <Breadcrumb />
      </div>
      <div className="col-span-12 flex flex-col gap-2 bg-background p-8 rounded-md border">
        <Form {...form}>
          <FormProvider {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(createProduct)}>
              <CreateProductBodyForm />
            </form>
          </FormProvider>
        </Form>
        <Button onClick={(e) => triggerSubmit(e)}>Add</Button>
      </div>

    </div>
  )
}

export { ProductCreateBody }
