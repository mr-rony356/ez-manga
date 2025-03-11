import { Product, Series, SubscriptionPlan } from '@/types'
import { get_cookies } from '../server'
import { Website_Local_API } from '@global'

export default class StoreAPI {
  protected API_Url: string = new URL('/v2', Website_Local_API).toString()
  protected cookies: string
  constructor() {
    this.cookies = get_cookies()
  }
  async get<T = any>(url: string, config: RequestInit = {}) {
    return (await (
      await fetch(`${this.API_Url}${url}`, {
        ...config,
        headers: {
          Cookie: this.cookies,
        },
      })
    ).json()) as T
  }
  async query_plans() {
    const series = await this.get<{ data: SubscriptionPlan[] }>(
      '/subscriptions'
    )
    return series
  }

  async query_products() {
    const products = await this.get<{ data: Product[] }>('/products')
    return products
  }

  async get_product(id: string) {
    const product = await this.get<Product>(`/products/${id}`)
    return product
  }
}
