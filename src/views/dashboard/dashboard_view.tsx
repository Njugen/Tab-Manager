import FoldersSection from './sections/folders_section';
import CurrentSessionSection from './sections/current_session_section';
import HistorySection from './sections/history_section';

const DashboardView = (props: any): JSX.Element => {
    return (
        <>
            <div>  
                <FoldersSection />
                <CurrentSessionSection />
                <HistorySection />
            </div>
            
        </>
    );
}

export default DashboardView;