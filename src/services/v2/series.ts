import { Series } from '@/types'
import { get_cookies } from '../server'
import { Website_Local_API } from '@global'

export default class SeriesAPI {
  protected API_Url: string = new URL(
    '/v2/series',
    Website_Local_API
  ).toString()
  protected cookies: string
  constructor() {
    this.cookies = get_cookies()
  }
  async get<T = any>(url: string) {
    return (await (
      await fetch(`${this.API_Url}${url}`, {
        headers: {
          Cookie: this.cookies,
        },
      })
    ).json()) as T
  }
  async get_all_series() {
    const series = await this.get<Series[]>('/list')
    return series
  }
}
