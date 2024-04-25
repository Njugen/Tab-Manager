import { handleShowResultsContainer, iHandleShowResultsContainerArgs } from "./handle_show_results_container";

interface iHandleWindowClickArgs {
    e: any,
    handleShowResultsArgs: iHandleShowResultsContainerArgs
}

 // Identify clicked viewport area and hide/show search results accordingly.
const handleWindowClick = (args: iHandleWindowClickArgs): void => {
    const { e, handleShowResultsArgs } = args;
    const { showResultsContainer } = handleShowResultsArgs;

    e.stopPropagation();

    const { target } = e;

    if(showResultsContainer === false || !target.parentElement || !target.parentElement.parentElement) return;
    
    const searchFieldId = "search-field";
    const searchResultsContainerId = "search-results-area";

    if(target.id.includes(searchFieldId) === false && target.id.includes(searchResultsContainerId) === true){
        handleShowResultsContainer(handleShowResultsArgs);
    }
}

export { handleWindowClick }