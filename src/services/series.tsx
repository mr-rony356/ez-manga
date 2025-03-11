import { AdminSeries, Tag } from '@/types'
import api from './api'
import axios from 'axios'
import { AnyAction, Dispatch } from 'redux'
import { Series } from '@/types'
import { SeriesOptionType } from '@/components/Header/Search'
import { Chapter } from '../types'

export async function search(term: string): Promise<SeriesOptionType[]> {
  const response = await api.get('/query?query_string=' + term)
  return response.data.data
}

export async function markAllAsRead(series_id: string) {
  await api.post('/bookmarks/actions', {
    type: 'mark_all_as_read',
    series_id,
  })
}

export type createSeriesPayload = {
  title: string
  description: string
  author: string
  release_year: string
  alternative_names: string
  adult: boolean
  visibility: 'Public' | 'Private'
  studio: string
  badge: string
  series_type: 'Comic' | 'Novel'
  thumbnail: any
}

export async function createSeries(payload: FormData) {
  const response = await api.post('/series/create', payload)
}

export async function createSeason(
  season_name: string,
  index: string,
  series_id: string | number
) {
  await api.post(`/seasons`, { series_id, season_name, index })
}

export async function getSeries(id: number | string): Promise<AdminSeries> {
  const response = await api.get(`/series/id/${id}`)

  return response.data
}

export async function updateSeries(data: any) {
  await api.put('/series/update', data)
}

export async function deleteChapter(chapter_id: string) {
  await api.delete('/chapter/', {
    data: {
      chapter_id,
    },
  })
}

export async function bookmarkSeries(series_slug: string) {
  await api.post('/bookmarks/' + series_slug)
}

export async function updateChapter(form: FormData) {
  await api.put('/chapter', form)
}

export async function clearNextCache(...tags: string[]) {
  await Promise.all([
    tags.map((tag) => axios.get(`/api/revalidate?tag=${tag}`)),
  ])
}

export async function updateSeriesViews(series_slug: string) {
  await api.post('/series/track', { series_slug })
}

export async function getTags() {
  return (await api.get('/tags')).data as Tag[]
}

export type queryParams = {
  query_string: string
  series_status: string
  orderBy: string
  order: string
  tags_ids: number[]
  series_type: string
  page: number
  perPage: number
}

export type queryResponse = {
  meta: {
    total: number
    current_page: number
    last_page: number
  }
  data: Series[]
}

export async function query(data: queryParams) {
  const { tags_ids, page, perPage, ...rest } = data

  const query_data = await api.get(
    `/query?${new URLSearchParams(
      rest
    ).toString()}&page=${page}&perPage=${perPage}&tags_ids=[${tags_ids}]`
  )
  return query_data.data as queryResponse
}

export async function deleteSeason(season_id: string) {
  await api.delete('/seasons', {
    data: { season_id },
  })
}

export type updateSeasonParams = {
  season_name: string
  index: number
  season_id: number | string
}

export async function updateSeason(params: updateSeasonParams) {
  await api.put('/seasons/', params)
}

export type GenreCreateParams = {
  name: string
  description: string
  color: string
}

export async function createGenre(data: GenreCreateParams) {
  await api.post('/tags', data)
}

export async function deleteGenre(tag_id: string) {
  await api.delete('/tags', {
    data: {
      tag_id,
    },
  })
}

export async function createGroup(name: string) {
  await api.post('/groups', { name })
}

export async function deleteGroup(group_id: number | string) {
  await api.delete('/groups', {
    data: { group_id },
  })
}

export async function updateChapterViews(
  series_slug: string,
  chapter_slug: string
) {
  await api.post('/chapter/track', { series_slug, chapter_slug })
}

export const deleteSeries = async (series_id: string | number) =>
  await api.delete('/series', { data: { series_id } })

export type ChaptersQueryResponse = {
  meta: {
    total: number
    current_page: number
    last_page: number
  }
  data: Chapter[]
}

export async function get_chapters_by_series_id(
  series_id: string | number,
  page: number,
  perPage: number
) {
  return (
    await api.post<ChaptersQueryResponse>('/chapter/query', {
      series_id,
      page,
      perPage,
    })
  ).data
}
