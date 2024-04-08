import SearchBarFolderList from './search_bar_folder_list';
import renderSessionTabs from './search_bar_session_tabs';
import SearchBarHistoryTabs from './search_bar_history_tabs';
import SearchBarSessionTabs from './search_bar_session_tabs';
import iSearchResultsProps from '../../../../interfaces/search_results_props';

// Show search results wrapper and list all results by keyword
const SearchResults = (props: iSearchResultsProps): JSX.Element => {
    const { keyword, folders, session, history, launchFolder } = props;
    let results: JSX.Element;

    if(keyword.length > 0 ){
        results = (
            <div className="grid grid-cols-2 gap-x-[1.75rem]">   
                
                <section className="mb-6">
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">
                        Folders
                    </h3>
                    <SearchBarFolderList items={folders} keyword={keyword} handleOpen={launchFolder} />
                </section>

                <section>
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">
                        History
                    </h3>
                    <SearchBarHistoryTabs items={history} keyword={keyword} />
                </section>
          
                <section>
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">
                        Currently opened
                    </h3>
                    <SearchBarSessionTabs keyword={keyword} items={session} />
                </section>
            </div>
        );
    } else {
        results = <p className="text-center">Enter a search term...</p>
    }

    return results;
}

export { renderSessionTabs, SearchResults };