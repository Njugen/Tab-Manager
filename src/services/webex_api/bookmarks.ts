const getBookmarks = (
	ids: Array<string>,
	callback: (results: Array<chrome.bookmarks.BookmarkTreeNode>) => void
): void => {
	chrome.bookmarks.get(ids, callback);
};

export { getBookmarks };
