import { getUserServer } from '@/lib/user'
import ReportsAndPrintingForm from './components/ReportsAndPrintingForm'

export default async function Service() {
    const user = getUserServer();
    return (
        <div className='card pb-4 max-w-7xl mx-auto'>
            <ReportsAndPrintingForm user={user} />
        </div>
    )
}
