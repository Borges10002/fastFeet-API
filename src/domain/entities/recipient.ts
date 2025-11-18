export interface Recipient {
  id: string
  name: string
  email?: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateRecipientRequest {
  name: string
  email?: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
}