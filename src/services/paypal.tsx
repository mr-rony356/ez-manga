import api from './api'

export interface PayPalCreateOrderResponse {
  id: string
  status: string
  links: {
    href: string
    rel: string
    method: string
  }[]
}

export async function createOrder(amount: number) {
  const response = await api.post<PayPalCreateOrderResponse>('/api/orders', {
    amount,
  })
  return response.data.id
}

export async function captureOrder(id: string) {
  const response = await api.post(`/api/orders/${id}/capture`)
  return response.data
}

export async function verifyPurchaseStatus(id: string) {
  const response = await api.get(`/api/orders/${id}/verify`)
  return response.data
}
