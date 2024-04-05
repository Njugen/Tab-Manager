import FoldersSection from './sections/folders_section';
import CurrentSessionSection from './sections/current_session_section';
import HistorySection from './sections/history_section';
import iView from '../../interfaces/view';
import SimpleCalendar from '../../components/features/simple_calendar';

const DashboardView = (props: iView): JSX.Element => {
    return (
        <>
        {/*<SimpleCalendar start={1970} end={2024} onSelectDate={() => {}} />*/}
            <div>  
                <FoldersSection />
                <CurrentSessionSection />
                <HistorySection />
            </div>
            
        </>
    );
}

export default DashboardView;