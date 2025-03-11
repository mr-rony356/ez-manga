import { ProductsQueryResponse, SubscriptionPlansQueryResponse } from '@/types'
import { Website_Local_API } from '@global'
import { cookies } from 'next/headers'

export * from './auth'

export type QueryProductsParams = {
  per_page: number
  page: number
  query: string
  order: 'asc' | 'desc'
  status: 'Active' | 'Draft' | 'Archived' | 'All'
  order_by:
    | 'id'
    | 'name'
    | 'status'
    | 'price'
    | 'currency_code'
    | 'is_subscription_product'
}

export function get_cookies() {
  const cookieStore = cookies()
  return cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ')
}

export const defaultParams: QueryProductsParams = {
  per_page: 10,
  page: 1,
  query: '',
  order: 'desc',
  order_by: 'id',
  status: 'All',
}

export const queryProducts = async (
  params: QueryProductsParams = defaultParams
) => {
  const productsQueryResponse: ProductsQueryResponse = await (
    await fetch(
      `${Website_Local_API}/v2/products?${new URLSearchParams(
        JSON.parse(JSON.stringify(params))
      ).toString()}`,
      {
        headers: {
          Cookie: get_cookies(),
        },
      }
    )
  ).json()

  return productsQueryResponse
}

export type QueryPlansParams = {
  per_page: number
  page: number
  query: string
  order: 'asc' | 'desc'
  status: 'ACTIVE' | 'INACTIVE' | 'CREATED' | 'All'
  order_by:
    | 'id'
    | 'name'
    | 'status'
    | 'value'
    | 'currency_code'
    | 'is_subscription_product'
}

export const defaultPlansParams: QueryPlansParams = {
  per_page: 10,
  page: 1,
  query: '',
  order: 'desc',
  order_by: 'id',
  status: 'All',
}

export const queryPlans = async (
  params: QueryPlansParams = defaultPlansParams
) => {
  const plansQueryResponse: SubscriptionPlansQueryResponse = await (
    await fetch(
      `${Website_Local_API}/v2/subscriptions?${new URLSearchParams(
        JSON.parse(JSON.stringify(params))
      ).toString()}`,
      {
        headers: {
          Cookie: get_cookies(),
        },
      }
    )
  ).json()

  return plansQueryResponse
}
