import { Website_Name } from '@global'
import { Metadata } from 'next'
import CreateSeriesForm from './components/CreateSeriesForm'

export const metadata: Metadata = {
  title: 'New series - ' + Website_Name,
}

const CreateSeriesComponent = () => {
  return (
    <div className="container px-5 lg:px-0">
      <CreateSeriesForm />
    </div>
  )
}
export default CreateSeriesComponent
