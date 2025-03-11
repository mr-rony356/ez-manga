import { Website_Name } from '@global'
import { Metadata } from 'next'
import PlanForm from './components/form';

export const metadata: Metadata = {
  title: 'Add product - ' + Website_Name,
}

const CreateAnnouncementComponent = () => {
  return (
    <div className="container px-5 lg:px-0 min-h-screen">
      <PlanForm />
    </div>
  )
}
export default CreateAnnouncementComponent
