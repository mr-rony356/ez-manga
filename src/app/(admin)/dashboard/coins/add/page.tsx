import { Website_Name } from '@global'
import { Metadata } from 'next'
import { ProductCreateBody } from './components/CreateBody'
import SeriesAPI from '@/services/v2/series'

export const metadata: Metadata = {
  title: 'Add coins package - ' + Website_Name,
}

const CreateAnnouncementComponent = async () => {
  const series_api = new SeriesAPI()
  const series = await series_api.get_all_series()
  return (
    <>
      <div className="container px-5 lg:px-0 min-h-screen">
        <ProductCreateBody series={series} />
      </div>
    </>
  )
}
export default CreateAnnouncementComponent
