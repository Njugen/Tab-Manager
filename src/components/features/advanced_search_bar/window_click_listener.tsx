import { IHandleShowResultsContainerProps, handleShowResultsContainer } from "./handle_show_results_container";

interface IHandleWindowClickProps {
    e: any,
    handleShowResultsProps: IHandleShowResultsContainerProps
}

 // Identify clicked viewport area and hide/show search results accordingly.
const handleWindowClick = (props: IHandleWindowClickProps): void => {
    const { e, handleShowResultsProps } = props;
    const { showResultsContainer } = handleShowResultsProps;

    e.stopPropagation();

    const { target } = e;

    if(showResultsContainer === false || !target.parentElement || !target.parentElement.parentElement) return;
    
    const searchFieldId = "search-field";
    const searchResultsContainerId = "search-results-area";

    if(target.id.includes(searchFieldId) === false && target.id.includes(searchResultsContainerId) === true){
        handleShowResultsContainer(handleShowResultsProps);
    }
}

export { IHandleWindowClickProps, handleWindowClick }