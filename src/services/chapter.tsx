import API from "./api";

export async function update_chapter_views(series_slug: string, chapter_slug: string) {
    await API.post('/series/chapter/updateviews', {
        series_slug, chapter_slug
    })
}

export async function buy_chapter(chapter_id: number) {
    await API.post(`/api/buy/${chapter_id}`)
}