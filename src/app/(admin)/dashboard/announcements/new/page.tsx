import { Website_Name } from '@global'
import { Metadata } from 'next'
import { AnnouncementCreateBody } from './components/CreateBody'

export const metadata: Metadata = {
  title: 'New announcement - ' + Website_Name,
}

const CreateAnnouncementComponent = () => {
  return (
    <div className="container px-5 lg:px-0">
      <AnnouncementCreateBody />
    </div>
  )
}
export default CreateAnnouncementComponent
