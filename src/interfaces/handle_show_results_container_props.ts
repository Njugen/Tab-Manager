interface iHandleShowResultsContainerProps {
    searchResultsContainerRef: React.RefObject<HTMLDivElement>,
    showResultsContainer: boolean,
    slideDown: boolean,
    setSlideDown: React.Dispatch<React.SetStateAction<boolean>>,
    setShowResultsContainer: React.Dispatch<React.SetStateAction<boolean>>
}

export default iHandleShowResultsContainerProps;