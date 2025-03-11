import { Website_Name } from '@global'
import { Metadata } from 'next'
import CreateBanner from './components/CreateBanner'
import { getAllSeries, getBanners } from '@/services/server/series'
import BannerItem from './components/BannerItem'

export const metadata: Metadata = {
  title: 'Banners - ' + Website_Name,
}

export default async function BannersPage() {
  const series = await getAllSeries()
  const banners = await getBanners()


  return (
    <div className="container min-h-screen">
      <div className="grid grid-cols-1 gap-3">
        <CreateBanner series={series} />
        {banners &&
          banners.length > 0 &&
          banners.map((banner) => (
            <BannerItem key={banner.id} banner={banner} />
          ))}
      </div>
    </div>
  )
}
