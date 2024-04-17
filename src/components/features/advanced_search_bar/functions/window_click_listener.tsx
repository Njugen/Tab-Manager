import iHandleWindowClickProps from "../../../../interfaces/handle_window_click_props";
import { handleShowResultsContainer } from "./handle_show_results_container";

 // Identify clicked viewport area and hide/show search results accordingly.
const handleWindowClick = (props: iHandleWindowClickProps): void => {
    const { e, handleShowResultsProps } = props;
    const { showResultsContainer } = handleShowResultsProps;

    e.stopPropagation();

    const { target } = e;

    if(showResultsContainer === false || !target.parentElement || !target.parentElement.parentElement) return;
    
    const searchFieldId = "search-field";
    const searchResultsContainerId = "search-results-area";

    if(target.id.includes(searchFieldId) === false && target.id.includes(searchResultsContainerId) === true){
        console.log("CLICK");
        handleShowResultsContainer(handleShowResultsProps);
    }
}

export { handleWindowClick }