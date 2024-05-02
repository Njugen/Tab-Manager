const tabViewModeCSS = (mode: "list" | "grid") => {
	if (mode === "list") {
		return "mx-auto mt-4";
	} else {
		return "grid xl:grid-cols-3 2xl:grid-cols-3 grid-flow-dense gap-x-3 gap-y-0 mt-6 pr-2";
	}
};

export default tabViewModeCSS;
