interface iHandleShowResultsContainerArgs {
	searchResultsContainerRef: React.RefObject<HTMLDivElement>;
	showResultsContainer: boolean;
	slideDown: boolean;
	handleSlideDown: (e: boolean) => void;
	setShowResultsContainer: React.Dispatch<React.SetStateAction<boolean>>;
}

// Mandles the mechanic of showing search results in the UI
const handleShowResultsContainer = (args: iHandleShowResultsContainerArgs): void => {
	const { searchResultsContainerRef, showResultsContainer, slideDown, handleSlideDown, setShowResultsContainer } =
		args;

	if (showResultsContainer === false) {
		setShowResultsContainer(true);
		handleSlideDown(slideDown ? false : true);
	} else {
		if (searchResultsContainerRef.current) {
			searchResultsContainerRef.current.classList.remove("mt-20");
			searchResultsContainerRef.current.classList.add("mt-10");
		}
		document.body.style.overflow = "auto";
		handleSlideDown(false);
		setShowResultsContainer(false);
	}
};

export { handleShowResultsContainer, iHandleShowResultsContainerArgs };
