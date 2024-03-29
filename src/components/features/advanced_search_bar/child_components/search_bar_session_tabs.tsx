import TabItem from '../../tab_item';
import { filterSessionTabsByString } from '../../../../tools/tab_filters';
import iCurrentSessionState from "../../../../interfaces/states/current_session_state";

interface ISearchBarSessionTabsProps {
    items: iCurrentSessionState,
    keyword: string
}

// Render all filtered session tabs
const SearchBarSessionTabs = (props: ISearchBarSessionTabsProps): JSX.Element => {
    const { items, keyword } = props;
    const tabs: Array<chrome.tabs.Tab> = filterSessionTabsByString(items, keyword);
    
    if(tabs.length > 0){
        const list: Array<JSX.Element> = tabs.map((tab) => {
            const { id, title,url } = tab;
            
            return (
                <TabItem 
                    key={`tab-session-sr-key-${id}`} 
                    marked={false} 
                    id={id!} 
                    label={title!} 
                    url={url!} 
                    disableEdit={true} 
                    disableMark={true} 
                    disableCloseButton={false} 
                    onClose={() => id && chrome.tabs.remove(id)} 
                />
            )
        });

        return <>{list}</>
    } 
    
    return (
        <p className="text-center p-2">There are no results in this section</p>
    );
}

export default SearchBarSessionTabs;