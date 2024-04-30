import FoldersSection from './sections/folders_section';
import SessionSection from './sections/session_section';
import HistorySection from './sections/history_section';

const DashboardView = (props: any): JSX.Element => {
    return (
        <>
            <div>  
                <FoldersSection />
                <SessionSection />
                <HistorySection />
            </div>
            
        </>
    );
}

export default DashboardView;