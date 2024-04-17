import iHandleShowResultsContainerProps from "../../../../interfaces/handle_show_results_container_props";

 // Show search results by sliding in the results area
const handleShowResultsContainer = (props: iHandleShowResultsContainerProps): void => {
    const { searchResultsContainerRef, showResultsContainer, slideDown, handleSlideDown, setShowResultsContainer } = props;

    if(showResultsContainer === false){
        console.log("AAA");
        setShowResultsContainer(true);
        handleSlideDown(slideDown === true ? false : true);
      
    } else {
        console.log("BBB");
        if(searchResultsContainerRef.current){
            searchResultsContainerRef.current.classList.remove("mt-20");
            searchResultsContainerRef.current.classList.add("mt-10");
        } 
        document.body.style.overflowY = "auto";
        handleSlideDown(false);
        setShowResultsContainer(false);
    }
}

export { handleShowResultsContainer };