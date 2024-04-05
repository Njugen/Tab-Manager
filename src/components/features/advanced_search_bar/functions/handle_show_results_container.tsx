import iHandleShowResultsContainerProps from "../../../../interfaces/handle_show_results_container_props";

 // Show search results by sliding in the results area
const handleShowResultsContainer = (props: iHandleShowResultsContainerProps): void => {
    const { searchResultsContainerRef, showResultsContainer, slideDown, setSlideDown, setShowResultsContainer } = props;

    if(showResultsContainer === false){
        setShowResultsContainer(true);
        setSlideDown(slideDown === true ? false : true);
      
    } else {
        if(searchResultsContainerRef.current){
            searchResultsContainerRef.current.classList.remove("mt-20");
            searchResultsContainerRef.current.classList.add("mt-10");
        } 
        document.body.style.overflowY = "auto";
        setSlideDown(false);
        setShowResultsContainer(false);
    }
}

export { handleShowResultsContainer };