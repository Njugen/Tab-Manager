const getAllWindows = (callback: any): void => {
	chrome.windows.getAll(
		{
			windowTypes: ["normal"]
		},
		(data: any) => {
			callback(data);
		}
	);
};

export { getAllWindows };
