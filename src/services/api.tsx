import axios from 'axios'
import {Website_API} from '../../consts'

export function getAPIClient() {
    const api = axios.create({
        baseURL: Website_API,
        withCredentials: true,
    })
    api.interceptors.request.use((config) => {
        config.withCredentials = true
        return config
    })


    return api
}

const API = getAPIClient()

export const fetcher = (url: string) => {
    return API.get(url).then((res) => res.data)
}

export default API
