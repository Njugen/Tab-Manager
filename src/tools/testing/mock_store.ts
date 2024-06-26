import randomNumber from "../random_number";
import { iFolderItem } from "../../interfaces/folder_item";
import { reducers } from "../../redux-toolkit/store";
import { configureStore } from "@reduxjs/toolkit";
import iHistoryState from "../../interfaces/states/history_state";
import iCurrentSessionState from "../../interfaces/states/current_session_state";

// Create mock folders
const mockFolders: Array<iFolderItem> = [
	{
		id: 0,
		name: "Katter på Borgbacken",
		desc: randomNumber().toString(),
		marked: false,
		display: "collapsed",
		viewMode: "list",
		windows: [
			{
				id: 0,
				tabs: [
					{
						id: 0,
						label: randomNumber().toString(),
						url: `http://${randomNumber()}.com`
					},
					{
						id: 1,
						label: randomNumber().toString(),
						url: `http://${randomNumber()}.com`
					},
					{
						id: 2,
						label: randomNumber().toString(),
						url: `http://${randomNumber()}.com`
					},
					{
						id: 3,
						label: randomNumber().toString(),
						url: `http://${randomNumber()}.com`
					},
					{
						id: 4,
						label: randomNumber().toString(),
						url: `http://${randomNumber()}.com`
					}
				]
			}
		]
	},
	{
		id: 1,
		name: "Vasa Övningsskola",
		desc: randomNumber().toString(),
		marked: false,
		display: "collapsed",
		viewMode: "list",
		windows: [
			{
				id: 0,
				tabs: [
					{
						id: 0,
						label: randomNumber().toString(),
						url: `http://${randomNumber()}.com`
					}
				]
			}
		]
	},
	{
		id: 2,
		name: "Japanese popculture",
		desc: randomNumber().toString(),
		marked: false,
		display: "collapsed",
		viewMode: "list",
		windows: [
			{
				id: 0,
				tabs: [
					{
						id: 0,
						label: randomNumber().toString(),
						url: `http://${randomNumber()}.com`
					}
				]
			}
		]
	},
	{
		id: 3,
		name: "Tab Manager",
		desc: randomNumber().toString(),
		marked: false,
		display: "collapsed",
		viewMode: "list",
		windows: [
			{
				id: 0,
				tabs: [
					{
						id: 0,
						label: randomNumber().toString(),
						url: `http://${randomNumber()}.com`
					}
				]
			}
		]
	}
];

const mockSession: iCurrentSessionState = {
	windows: JSON.parse(
		`[{"alwaysOnTop":false,"focused":true,"height":1056,"id":892790470,"incognito":false,"left":2552,"state":"maximized","tabs":[{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://www.redditstatic.com/shreddit/assets/favicon/64x64.png","groupId":-1,"height":917,"highlighted":false,"id":892790471,"incognito":false,"index":0,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"unloaded","title":"Why react native and not flutter? : r/reactnative","url":"https://www.reddit.com/r/reactnative/comments/13vm59d/why_react_native_and_not_flutter/","width":1920,"windowId":892790470},{"active":false,"audible":false,"autoDiscardable":true,"discarded":true,"favIconUrl":"https://www.redditstatic.com/shreddit/assets/favicon/64x64.png","groupId":-1,"height":0,"highlighted":false,"id":892790752,"incognito":false,"index":1,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"unloaded","title":"How to call setState multiple times inside a function? : r/reactnative","url":"https://www.reddit.com/r/reactnative/comments/16d4lxn/how_to_call_setstate_multiple_times_inside_a/","width":0,"windowId":892790470},{"active":false,"audible":false,"autoDiscardable":true,"discarded":true,"favIconUrl":"https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196","groupId":-1,"height":0,"highlighted":false,"id":892790677,"incognito":false,"index":2,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"unloaded","title":"JavaScript: clone a function - Stack Overflow","url":"https://stackoverflow.com/questions/1833588/javascript-clone-a-function","width":0,"windowId":892790470},{"active":false,"audible":false,"autoDiscardable":true,"discarded":true,"favIconUrl":"https://redux-toolkit.js.org/img/favicon/favicon.ico","groupId":-1,"height":0,"highlighted":false,"id":892790683,"incognito":false,"index":3,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"unloaded","title":"Usage Guide | Redux Toolkit","url":"https://redux-toolkit.js.org/usage/usage-guide#considerations-for-using-createreducer","width":0,"windowId":892790470},{"active":false,"audible":false,"autoDiscardable":true,"discarded":true,"favIconUrl":"https://www.google.com/favicon.ico","groupId":-1,"height":0,"highlighted":false,"id":892790689,"incognito":false,"index":4,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"unloaded","title":"premier league - Google Search","url":"https://www.google.com/search?q=premier+league&sca_esv=9d84270ee46763bd&sca_upv=1&sxsrf=ACQVn0_txemQsS-NnLqdVnnvSywUkaZ0KA%3A1713011398487&source=hp&ei=xnoaZqDSG-K_wPAP4pC_iAs&iflsig=ANes7DEAAAAAZhqI1qfPnUiUNMLxiiBiajet1AqsfoF9&oq=prem&gs_lp=Egdnd3Mtd2l6IgRwcmVtKgIIADIKEC4YgAQYigUYJzIKECMYgAQYigUYJzIKECMYgAQYigUYJzIKEAAYgAQYigUYQzIFEAAYgAQyBRAuGIAEMgUQABiABDIFEAAYgAQyCxAuGK8BGMcBGIAEMgUQABiABEjGDFAAWIUDcAB4AJABAJgBdaAB1wKqAQMzLjG4AQPIAQD4AQGYAgSgApMDwgIEECMYJ8ICCxAAGIAEGIoFGJECwgIKEAAYgAQYFBiHApgDAJIHAzIuMqAH6DU&sclient=gws-wiz#sie=lg;/g/11sk7gnh6c;2;/m/02_tc;mt;fp;1;;;","width":0,"windowId":892790470},{"active":false,"audible":false,"autoDiscardable":true,"discarded":true,"favIconUrl":"","groupId":-1,"height":0,"highlighted":false,"id":892790761,"incognito":false,"index":5,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"unloaded","title":"Extensions - Tab Management Browser Plugin","url":"chrome://extensions/?id=iiledhelfbkjojhccgmjjopheodeofhk","width":0,"windowId":892790470},{"active":false,"audible":false,"autoDiscardable":true,"discarded":true,"favIconUrl":"https://www.google.com/favicon.ico","groupId":-1,"height":0,"highlighted":false,"id":892790715,"incognito":false,"index":6,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"unloaded","title":"jest react toolkit test - Google Search","url":"https://www.google.com/search?q=jest+react+toolkit+test&sca_esv=b153c82eb27ce53b&sca_upv=1&sxsrf=ACQVn0_5Xy9yCihYLltGBPfPzlIFaEJALg%3A1713192269111&ei=TT0dZpquBq2OwPAPlaCBqAM&ved=0ahUKEwjaiIfFusSFAxUtBxAIHRVQADUQ4dUDCBA&uact=5&oq=jest+react+toolkit+test&gs_lp=Egxnd3Mtd2l6LXNlcnAiF2plc3QgcmVhY3QgdG9vbGtpdCB0ZXN0MgUQIRigATIFECEYoAFI0DhQAFiwN3AEeAGQAQCYAaoBoAGCEaoBBDIxLjS4AQPIAQD4AQGYAh2gAvMSwgIEECMYJ8ICChAjGIAEGIoFGCfCAgsQABiABBiKBRiRAsICCxAuGIAEGMcBGNEDwgIFEC4YgATCAgoQABiABBiKBRhDwgIFEAAYgATCAgYQABgWGB7CAgsQABiABBiKBRiGA8ICCBAAGAgYHhgNwgIEECEYFZgDAJIHBDIzLjagB6mkAQ&sclient=gws-wiz-serp","width":0,"windowId":892790470},{"active":false,"audible":false,"autoDiscardable":true,"discarded":true,"favIconUrl":"https://redux.js.org/img/favicon/favicon.ico","groupId":-1,"height":0,"highlighted":false,"id":892790755,"incognito":false,"index":7,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"unloaded","title":"Writing Tests | Redux","url":"https://redux.js.org/usage/writing-tests","width":0,"windowId":892790470},{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://cdn.freecodecamp.org/universal/favicons/favicon.ico","groupId":-1,"height":919,"highlighted":false,"id":892790758,"incognito":false,"index":8,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"How JavaScript's Proxy Object Works – Explained with Example Use Cases","url":"https://www.freecodecamp.org/news/javascript-proxy-object/","width":1920,"windowId":892790470},{"active":true,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"","groupId":-1,"height":919,"highlighted":true,"id":892790748,"incognito":false,"index":9,"lastAccessed":1713289595969.156,"mutedInfo":{"muted":false},"pinned":false,"selected":true,"status":"complete","title":"Tab Manager","url":"chrome-extension://iiledhelfbkjojhccgmjjopheodeofhk/options.html#main","width":1424,"windowId":892790470},{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"https://www.gstatic.com/devrel-devsite/prod/v66c4dc9b65fea2172a0927d7be81b5b5d946ea60fc02578dd7c264b2c2852152/chrome/images/favicon.png","groupId":-1,"height":919,"highlighted":false,"id":892790680,"incognito":false,"index":10,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"chrome.windows  |  API  |  Chrome for Developers","url":"https://developer.chrome.com/docs/extensions/reference/api/windows#type-QueryOptions","width":1920,"windowId":892790470},{"active":false,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"","groupId":-1,"height":919,"highlighted":false,"id":892790751,"incognito":false,"index":11,"mutedInfo":{"muted":false},"pinned":false,"selected":false,"status":"complete","title":"New Tab","url":"chrome://newtab/","width":1920,"windowId":892790470}],"top":-8,"type":"normal","width":1936},{"alwaysOnTop":false,"focused":false,"height":784,"id":892790764,"incognito":false,"left":1462,"state":"normal","tabs":[{"active":true,"audible":false,"autoDiscardable":true,"discarded":false,"favIconUrl":"","groupId":-1,"height":654,"highlighted":true,"id":892790765,"incognito":false,"index":0,"lastAccessed":1713289414192.512,"mutedInfo":{"muted":false},"pinned":false,"selected":true,"status":"complete","title":"New Tab","url":"chrome://newtab/","width":605,"windowId":892790764}],"top":424,"type":"normal","width":621}]`
	),
	markedWindows: [],
	markedTabs: [],
	tabsSort: "asc",
	viewMode: "grid"
};

const mockHistory: iHistoryState = {
	tabs: JSON.parse(
		`[{"id":"8","lastVisitTime":1713289001891.277,"title":"chrome.history | API | Chrome for Developers","typedCount":1,"url":"https://developer.chrome.com/docs/extensions/reference/api/history#method-search","visitCount":12},{"id":"175","lastVisitTime":1713288985418.757,"title":"chrome.history | API | Chrome for Developers","typedCount":0,"url":"https://developer.chrome.com/docs/extensions/reference/api/history#method-getVisits","visitCount":4},{"id":"1178","lastVisitTime":1713288861905.016,"title":"How JavaScript's Proxy Object Works – Explained with Example Use Cases","typedCount":0,"url":"https://www.freecodecamp.org/news/javascript-proxy-object/","visitCount":1},{"id":"261","lastVisitTime":1713288377464.797,"title":"chrome.history | API | Chrome for Developers","typedCount":0,"url":"https://developer.chrome.com/docs/extensions/reference/api/history#type-HistoryItem","visitCount":3},{"id":"163","lastVisitTime":1713288339019.325,"title":"chrome.history | API | Chrome for Developers","typedCount":0,"url":"https://developer.chrome.com/docs/extensions/reference/api/history","visitCount":4},{"id":"122","lastVisitTime":1713286851902.346,"title":"chrome.windows | API | Chrome for Developers","typedCount":0,"url":"https://developer.chrome.com/docs/extensions/reference/api/windows#type-Window","visitCount":12},{"id":"688","lastVisitTime":1713286850825.158,"title":"chrome.tabs | API | Chrome for Developers","typedCount":0,"url":"https://developer.chrome.com/docs/extensions/reference/api/tabs","visitCount":5},{"id":"689","lastVisitTime":1713286586197.895,"title":"chrome.tabs | API | Chrome for Developers","typedCount":0,"url":"https://developer.chrome.com/docs/extensions/reference/api/tabs#type-Tab","visitCount":7},{"id":"696","lastVisitTime":1713285851915.864,"title":"chrome.windows | API | Chrome for Developers","typedCount":0,"url":"https://developer.chrome.com/docs/extensions/reference/api/windows#method-getAll","visitCount":9},{"id":"582","lastVisitTime":1713283669603.123,"title":"Tab Manager","typedCount":0,"url":"chrome-extension://iiledhelfbkjojhccgmjjopheodeofhk/options.html#main","visitCount":307},{"id":"697","lastVisitTime":1713283667644.15,"title":"Tab Manager","typedCount":0,"url":"chrome-extension://iiledhelfbkjojhccgmjjopheodeofhk/options.html#settings","visitCount":189},{"id":"86","lastVisitTime":1713282257851.304,"title":"Tab Manager","typedCount":12,"url":"chrome-extension://iiledhelfbkjojhccgmjjopheodeofhk/options.html","visitCount":136},{"id":"1177","lastVisitTime":1713282000397.323,"title":"proxy object - Google Search","typedCount":0,"url":"https://www.google.com/search?q=proxy+object&sca_esv=c3100514c60d20a4&sca_upv=1&sxsrf=ACQVn0-aiH2xJXXF-4rqbqQk-DjZvQ4BKg%3A1713247945497&ei=yRYeZteAHpTPwPAPxqu86Aw&ved=0ahUKEwiXidD5icaFAxWUJxAIHcYVD80Q4dUDCBA&uact=5&oq=proxy+object&gs_lp=Egxnd3Mtd2l6LXNlcnAiDHByb3h5IG9iamVjdDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgARImixQ2wdYoxdwAXgBkAEAmAGAAaABzgeqAQQxMC4yuAEDyAEA-AEBmAINoALvCMICChAAGEcY1gQYsAPCAgoQLhiABBiKBRgnwgIKECMYgAQYigUYJ8ICBBAjGCfCAgsQABiABBiKBRiRAsICFxAuGIAEGIoFGJcFGNwEGN4EGOAE2AEBwgIKEAAYgAQYigUYQ8ICBRAuGIAEmAMAiAYBkAYGugYGCAEQARgUkgcEMTAuM6AHgFY&sclient=gws-wiz-serp","visitCount":2},{"id":"1175","lastVisitTime":1713281991930.683,"title":"apotek minimani vasa - Google Search","typedCount":0,"url":"https://www.google.com/search?q=apotek+minimani+vasa&sca_esv=c3100514c60d20a4&sca_upv=1&sxsrf=ACQVn0_WVuKe6BGaCoPyO04z_J3UAL4zdQ%3A1713247934669&ei=vhYeZsOtKPOqwPAPieW90AQ&ved=0ahUKEwjDhLv0icaFAxVzFRAIHYlyD0oQ4dUDCBA&uact=5&oq=apotek+minimani+vasa&gs_lp=Egxnd3Mtd2l6LXNlcnAiFGFwb3RlayBtaW5pbWFuaSB2YXNhMg4QLhiABBjLARjHARivATIdEC4YgAQYywEYxwEYrwEYlwUY3AQY3gQY4ATYAQFI0AhQZFigB3ABeAGQAQCYAZsBoAGbA6oBAzMuMbgBA8gBAPgBAZgCBaAC2gPCAgoQABhHGNYEGLADwgIOEC4YrwEYxwEYywEYgATCAggQABiABBjLAcICAhAmwgILEAAYgAQYigUYhgPCAh0QLhivARjHARjLARiABBiXBRjcBBjeBBjgBNgBAZgDAIgGAZAGBboGBggBEAEYFJIHAzMuMqAHqBQ&sclient=gws-wiz-serp","visitCount":2},{"id":"915","lastVisitTime":1713279019718.544,"title":"How to call setState multiple times inside a function? : r/reactnative","typedCount":0,"url":"https://www.reddit.com/r/reactnative/comments/16d4lxn/how_to_call_setstate_multiple_times_inside_a/","visitCount":4},{"id":"1176","lastVisitTime":1713273569856.949,"title":"jest react toolkit test - Google Search","typedCount":0,"url":"https://www.google.com/search?q=jest+react+toolkit+test&sca_esv=b153c82eb27ce53b&sca_upv=1&sxsrf=ACQVn0_5Xy9yCihYLltGBPfPzlIFaEJALg%3A1713192269111&ei=TT0dZpquBq2OwPAPlaCBqAM&ved=0ahUKEwjaiIfFusSFAxUtBxAIHRVQADUQ4dUDCBA&uact=5&oq=jest+react+toolkit+test&gs_lp=Egxnd3Mtd2l6LXNlcnAiF2plc3QgcmVhY3QgdG9vbGtpdCB0ZXN0MgUQIRigATIFECEYoAFI0DhQAFiwN3AEeAGQAQCYAaoBoAGCEaoBBDIxLjS4AQPIAQD4AQGYAh2gAvMSwgIEECMYJ8ICChAjGIAEGIoFGCfCAgsQABiABBiKBRiRAsICCxAuGIAEGMcBGNEDwgIFEC4YgATCAgoQABiABBiKBRhDwgIFEAAYgATCAgYQABgWGB7CAgsQABiABBiKBRiGA8ICCBAAGAgYHhgNwgIEECEYFZgDAJIHBDIzLjagB6mkAQ&sclient=gws-wiz-serp","visitCount":2},{"id":"1137","lastVisitTime":1713273558275.543,"title":"jest redux preloaded state - Google Search","typedCount":0,"url":"https://www.google.com/search?q=jest+redux+preloaded+state&sca_esv=b153c82eb27ce53b&sca_upv=1&sxsrf=ACQVn0-CctdqwZLdG8---IaUM9qSoCyYlw%3A1713192262833&source=hp&ei=Rj0dZtHgMJGrwPAPqsO8yAM&iflsig=ANes7DEAAAAAZh1LVshxcJ0iXb3ry_ncICKsqgilY6mG&oq=jest+redux+preloaded&gs_lp=Egdnd3Mtd2l6IhRqZXN0IHJlZHV4IHByZWxvYWRlZCoCCAAyBRAhGKABSNMnUABYgiRwAHgAkAEAmAG9AaABmxKqAQQxOC43uAEDyAEA-AEBmAIZoALYE8ICChAjGIAEGIoFGCfCAgsQABiABBiKBRiRAsICChAAGIAEGIoFGEPCAgUQABiABMICCxAuGIAEGMcBGNEDwgIFEC4YgATCAgQQIxgnwgIKEAAYgAQYFBiHAsICCxAAGIAEGIoFGIYDwgIGEAAYFhgewgIHECEYChigAZgDAOIDBRIBMSBAkgcGMTcuNy4xoAeKtAE&sclient=gws-wiz","visitCount":3},{"id":"1139","lastVisitTime":1713273469252.468,"title":"Writing Tests | Redux","typedCount":0,"url":"https://redux.js.org/usage/writing-tests","visitCount":2},{"id":"1174","lastVisitTime":1713247934429.714,"title":"apotek minimani - Google Search","typedCount":0,"url":"https://www.google.com/search?q=apotek+minimani&sca_esv=c3100514c60d20a4&sca_upv=1&sxsrf=ACQVn08TLNwUWjnH6q_CJVwOTa_UGplXyg%3A1713247928268&source=hp&ei=uBYeZvuRDJfUwPAPiJukoAI&iflsig=ANes7DEAAAAAZh4kyLn8kQGqRmsDya37PZzHnuNWNAHg&gs_ssp=eJzj4tVP1zc0zLI0Kc4uyjUwYLRSNagwMTNPMTM0NTJOTjM0SzRLsTKoSDEzTUkzNrBMtTRMSzVOMvfiTyzIL0nNVsjNzMvMTczLBADIARU4&oq=apotek+mini&gs_lp=Egdnd3Mtd2l6IgthcG90ZWsgbWluaSoCCAAyDhAuGK8BGMcBGMsBGIAEMggQABiABBjLATIFEAAYgAQyBRAAGIAEMggQABiABBjLATIFEAAYgAQyBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHki2IlAAWPYacAJ4AJABAZgBrQGgAfwLqgEDOS42uAEDyAEA-AEBmAIQoAKiDMICChAjGIAEGIoFGCfCAgQQIxgnwgILEAAYgAQYigUYkQLCAgsQLhiABBjHARjRA8ICEBAuGEMYxwEY0QMYgAQYigXCAhAQLhiABBiKBRhDGMcBGNEDwgIKEAAYgAQYigUYQ8ICChAuGIAEGIoFGEPCAgUQLhiABMICCBAuGIAEGNQCwgIOEC4YgAQYywEYxwEY0QPCAg4QLhiABBjLARjHARivAcICCxAuGIAEGMcBGK8BmAMAkgcEMTAuNqAH3pYB&sclient=gws-wiz","visitCount":2},{"id":"684","lastVisitTime":1713247928658.819,"title":"Google","typedCount":20,"url":"https://www.google.com/","visitCount":167},{"id":"1173","lastVisitTime":1713247828813.89,"title":"html - How to get element by proximity to another element in React Testing Library - Stack Overflow","typedCount":0,"url":"https://stackoverflow.com/questions/62962771/how-to-get-element-by-proximity-to-another-element-in-react-testing-library","visitCount":1},{"id":"1170","lastVisitTime":1713247749150.009,"title":"jest get parent element - Google Search","typedCount":0,"url":"https://www.google.com/search?q=jest+get+parent+element&sca_esv=c3100514c60d20a4&sca_upv=1&sxsrf=ACQVn0-bc4x2UWAOc6yHGokF8T1XhG3Hrg%3A1713247633160&source=hp&ei=kRUeZtayBuCrwPAP2rCu6A8&iflsig=ANes7DEAAAAAZh4jobAJkiBCFmZ_Drw2KWtqzUNPOuO6&oq=jest+get+parent&gs_lp=Egdnd3Mtd2l6Ig9qZXN0IGdldCBwYXJlbnQqAggAMgUQABiABEiHFFAAWJgOcAB4AJABAZgBtgGgAeIKqgEDOS41uAEDyAEA-AEBmAINoAKxCsICBBAjGCfCAgoQABiABBiKBRhDwgIFEC4YgATCAgoQLhiABBiKBRhDwgIKECMYgAQYigUYJ8ICChAAGIAEGBQYhwLCAggQABiABBjLAcICCxAAGIAEGIoFGIYDmAMAkgcFOC40LjGgB4Vs&sclient=gws-wiz","visitCount":4},{"id":"1172","lastVisitTime":1713247743818.988,"title":"How to access child element from parent using react testing library? - Stack Overflow","typedCount":0,"url":"https://stackoverflow.com/questions/69896181/how-to-access-child-element-from-parent-using-react-testing-library","visitCount":1},{"id":"1171","lastVisitTime":1713247637960.101,"title":"html - Parent node in react-testing-library - Stack Overflow","typedCount":0,"url":"https://stackoverflow.com/questions/62770973/parent-node-in-react-testing-library","visitCount":1},{"id":"891","lastVisitTime":1713245699976.158,"title":"JavaScript: clone a function - Stack Overflow","typedCount":0,"url":"https://stackoverflow.com/questions/1833588/javascript-clone-a-function","visitCount":4},{"id":"954","lastVisitTime":1713245648267.977,"title":"Usage Guide | Redux Toolkit","typedCount":0,"url":"https://redux-toolkit.js.org/usage/usage-guide#considerations-for-using-createreducer","visitCount":1},{"id":"957","lastVisitTime":1713245644221.31,"title":"premier league - Google Search","typedCount":0,"url":"https://www.google.com/search?q=premier+league&sca_esv=9d84270ee46763bd&sca_upv=1&sxsrf=ACQVn0_txemQsS-NnLqdVnnvSywUkaZ0KA%3A1713011398487&source=hp&ei=xnoaZqDSG-K_wPAP4pC_iAs&iflsig=ANes7DEAAAAAZhqI1qfPnUiUNMLxiiBiajet1AqsfoF9&oq=prem&gs_lp=Egdnd3Mtd2l6IgRwcmVtKgIIADIKEC4YgAQYigUYJzIKECMYgAQYigUYJzIKECMYgAQYigUYJzIKEAAYgAQYigUYQzIFEAAYgAQyBRAuGIAEMgUQABiABDIFEAAYgAQyCxAuGK8BGMcBGIAEMgUQABiABEjGDFAAWIUDcAB4AJABAJgBdaAB1wKqAQMzLjG4AQPIAQD4AQGYAgSgApMDwgIEECMYJ8ICCxAAGIAEGIoFGJECwgIKEAAYgAQYFBiHApgDAJIHAzIuMqAH6DU&sclient=gws-wiz#sie=lg;/g/11sk7gnh6c;2;/m/02_tc;mt;fp;1;;;","visitCount":1},{"id":"1083","lastVisitTime":1713245641827.632,"title":"javascript - Mock a function from another file - Jest - Stack Overflow","typedCount":0,"url":"https://stackoverflow.com/questions/49359476/mock-a-function-from-another-file-jest","visitCount":1},{"id":"1077","lastVisitTime":1713245641013.653,"title":"reactjs - Jest mock redux toolkit actions/store files - Stack Overflow","typedCount":0,"url":"https://stackoverflow.com/questions/73815652/jest-mock-redux-toolkit-actions-store-files","visitCount":1},{"id":"1148","lastVisitTime":1713243502284.422,"title":"down syndrome - Google Search","typedCount":0,"url":"https://www.google.com/search?q=down+syndrome&sca_esv=4a83ddc72bf1c867&sca_upv=1&sxsrf=ACQVn0-FAFoaqBhfw_1uzpAmWZRb7V-EeQ%3A1713243294476&source=hp&ei=ngQeZsLbGr7_wPAPmP6VmAU&oq=dow&gs_lp=EhFtb2JpbGUtZ3dzLXdpei1ocCIDZG93KgIIADIKECMYgAQYigUYJzIFEAAYgAQyBRAAGIAEMgUQLhiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgARIhyFQngpYnhRwAXgAkAEAmAFUoAH2AaoBATO4AQHIAQD4AQGYAgSgApYDqAIPwgIHECMY6gIYJ8ICBxAuGOoCGCfCAg0QLhjHARivARjqAhgnwgIEECMYJ8ICCxAuGMcBGNEDGIAEwgILEC4YgAQYxwEY0QOYA0WSBwMxLjOgB6Mj&sclient=mobile-gws-wiz-hp#ip=1","visitCount":4},{"id":"1149","lastVisitTime":1713243500742.011,"title":"Down syndrome: Causes, characteristics, is it genetic, and more","typedCount":0,"url":"https://www.medicalnewstoday.com/articles/145554#what-is-down-syndrome","visitCount":1},{"id":"1150","lastVisitTime":1713243495218.072,"title":"Down syndrome: Causes, characteristics, is it genetic, and more","typedCount":0,"url":"https://www.medicalnewstoday.com/articles/145554","visitCount":1},{"id":"1151","lastVisitTime":1713243481793.25,"title":"World Down Syndrome Day | United Nations","typedCount":0,"url":"https://www.un.org/en/observances/down-syndrome-day","visitCount":1},{"id":"1152","lastVisitTime":1713243462209.958,"title":"Data and Statistics on Down Syndrome | CDC","typedCount":0,"url":"https://www.cdc.gov/ncbddd/birthdefects/downsyndrome/data.html","visitCount":1},{"id":"1153","lastVisitTime":1713243450535.481,"title":"down syndrome - Google Search","typedCount":0,"url":"https://www.google.com/search?q=down+syndrome&sca_esv=4a83ddc72bf1c867&sca_upv=1&sxsrf=ACQVn0-FAFoaqBhfw_1uzpAmWZRb7V-EeQ%3A1713243294476&source=hp&ei=ngQeZsLbGr7_wPAPmP6VmAU&oq=dow&gs_lp=EhFtb2JpbGUtZ3dzLXdpei1ocCIDZG93KgIIADIKECMYgAQYigUYJzIFEAAYgAQyBRAAGIAEMgUQLhiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgARIhyFQngpYnhRwAXgAkAEAmAFUoAH2AaoBATO4AQHIAQD4AQGYAgSgApYDqAIPwgIHECMY6gIYJ8ICBxAuGOoCGCfCAg0QLhjHARivARjqAhgnwgIEECMYJ8ICCxAuGMcBGNEDGIAEwgILEC4YgAQYxwEY0QOYA0WSBwMxLjOgB6Mj&sclient=mobile-gws-wiz-hp","visitCount":5},{"id":"1154","lastVisitTime":1713243411040.313,"title":"Down's syndrome - NHS","typedCount":0,"url":"https://www.nhs.uk/conditions/downs-syndrome/","visitCount":2},{"id":"1155","lastVisitTime":1713243324829.214,"title":"Down syndrome - Wikipedia","typedCount":0,"url":"https://en.m.wikipedia.org/wiki/Down_syndrome","visitCount":1},{"id":"1156","lastVisitTime":1713243306962.746,"title":"down syndrome - Google Search","typedCount":0,"url":"https://www.google.com/search?q=down+syndrome&sca_esv=4a83ddc72bf1c867&sca_upv=1&sxsrf=ACQVn0-FAFoaqBhfw_1uzpAmWZRb7V-EeQ%3A1713243294476&source=hp&ei=ngQeZsLbGr7_wPAPmP6VmAU&oq=dow&gs_lp=EhFtb2JpbGUtZ3dzLXdpei1ocCIDZG93KgIIADIKECMYgAQYigUYJzIFEAAYgAQyBRAAGIAEMgUQLhiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgARIhyFQngpYnhRwAXgAkAEAmAFUoAH2AaoBATO4AQHIAQD4AQGYAgSgApYDqAIPwgIHECMY6gIYJ8ICBxAuGOoCGCfCAg0QLhjHARivARjqAhgnwgIEECMYJ8ICCxAuGMcBGNEDGIAEwgILEC4YgAQYxwEY0QOYA0WSBwMxLjOgB6Mj&sclient=mobile-gws-wiz-hp#vhid=qlTQ8q-lHFrIWM&vssid=l","visitCount":2},{"id":"69","lastVisitTime":1713243296570.235,"title":"Google","typedCount":0,"url":"https://www.google.com/#sbfbu=1&pi=","visitCount":29},{"id":"66","lastVisitTime":1713243192003.525,"title":"Nyheter - senaste nyheterna i Sverige och världen","typedCount":31,"url":"https://www.expressen.se/","visitCount":65},{"id":"1157","lastVisitTime":1713243170337.646,"title":"Politikerns avgångskrav: Dubbla löner för miljoner | Sverige | Expressen","typedCount":0,"url":"https://www.expressen.se/nyheter/sverige/politikerns-avgangskrav--dubbla-loner-for-miljoner/","visitCount":1},{"id":"74","lastVisitTime":1713243110839.258,"title":"Nyheter från Sveriges största nyhetssajt","typedCount":6,"url":"https://www.aftonbladet.se/","visitCount":101},{"id":"1158","lastVisitTime":1713242963345.395,"title":"Äldre beställde olagliga vapen: ”Till självförsvar”","typedCount":0,"url":"https://www.aftonbladet.se/nyheter/a/73npyW/aldre-bestallde-olagliga-vapen-till-sjalvforsvar","visitCount":1},{"id":"128","lastVisitTime":1713213674379.108,"title":"Svenska Yle","typedCount":33,"url":"https://svenska.yle.fi/","visitCount":46},{"id":"1159","lastVisitTime":1713213665364.597,"title":"De Gröna vill att alla fossila bränslen ska vara borta redan 2040 – Politik – svenska.yle.fi","typedCount":0,"url":"https://svenska.yle.fi/a/7-10054917","visitCount":1},{"id":"1160","lastVisitTime":1713213592961.591,"title":"Realityprofil döms för misshandel – slog barn med fjärrkontroll","typedCount":0,"url":"https://www.aftonbladet.se/nojesbladet/a/Avzr45/realityprofil-doms-for-misshandel-slog-barn-med-fjarrkontroll","visitCount":1},{"id":"1161","lastVisitTime":1713213540549.645,"title":"Zaras krishantering – ett massmejl till de anställda","typedCount":0,"url":"https://www.aftonbladet.se/nyheter/a/151lQQ/ex-anstalld-alla-kallade-zaras-butikschef-for-haxan","visitCount":1},{"id":"1162","lastVisitTime":1713213310308.163,"title":"Zaras krishantering – ett massmejl till de anställda","typedCount":0,"url":"https://www.aftonbladet.se/nyheter/a/xmAlVp/zaras-krishantering-ett-massmejl-till-de-anstallda","visitCount":1},{"id":"1163","lastVisitTime":1713213302657.202,"title":"ANNONS: Världsunik svensk studie ska hindra hjärtinfarkter","typedCount":0,"url":"https://www.expressen.se/brandstudio/hjart-lungfonden/varldsunik-svensk-studie-ska-hindra-hjartinfarkter/","visitCount":1},{"id":"1053","lastVisitTime":1713213295772.713,"title":"Harry Kane gör allt – men det räcker ändå inte | Therese Strömberg | Expressen","typedCount":0,"url":"https://www.expressen.se/sport/kronikorer/therese-stromberg/harry-kane-gor-allt-men-det-racker-anda-inte/","visitCount":1},{"id":"1164","lastVisitTime":1713213282185.567,"title":"Trump vid domstolen: Ett angrepp på Amerika - Vasabladet","typedCount":0,"url":"https://www.vasabladet.fi/Artikel/Visa/775190","visitCount":1},{"id":"1165","lastVisitTime":1713213259379.151,"title":"Person omkom efter att ha blivit påkörd av tåg i Vasa - Vasabladet","typedCount":0,"url":"https://www.vasabladet.fi/Artikel/Visa/774925","visitCount":1},{"id":"102","lastVisitTime":1713213216538.457,"title":"Nyheter - Vasabladet","typedCount":4,"url":"https://www.vasabladet.fi/","visitCount":29},{"id":"1166","lastVisitTime":1713213169558.958,"title":"Hanna Gutierrez Reed dömd till fängelse efter ”Rust”-skjutningen","typedCount":0,"url":"https://www.aftonbladet.se/nojesbladet/a/VzlxLW/filmfotograf-dog-vapenansvarig-far-fangelse","visitCount":1},{"id":"1167","lastVisitTime":1713213101856.366,"title":"Premier League: Cole Palmer med hattrick på 16 minuter","typedCount":0,"url":"https://www.aftonbladet.se/sportbladet/fotboll/a/zA50pq/premier-league-cole-palmer-med-hattrick-pa-16-minuter","visitCount":1},{"id":"1168","lastVisitTime":1713212209424.144,"title":"Nula on the AppStore","typedCount":0,"url":"https://apps.apple.com/gb/app/nula/id6479223697","visitCount":1},{"id":"23","lastVisitTime":1713212059954.236,"title":"Spelnyheter, recensioner och community sedan 1996 - FZ.se","typedCount":0,"url":"https://www.fz.se/","visitCount":7},{"id":"1169","lastVisitTime":1713211948383.34,"title":"Final Fantasy 7 Rebirth leads surge of new hits | Japan Monthly Charts | GamesIndustry.biz","typedCount":0,"url":"https://www.gamesindustry.biz/final-fantasy-7-rebirth-leads-surge-of-new-hits-japan-monthly-charts","visitCount":1}]`
	),
	markedTabs: [],
	tabSortOptionId: 0,
	viewMode: "grid",
	expanded: false
};

const mockStore = configureStore({
	reducer: reducers,
	preloadedState: {
		folder: mockFolders,
		sessionSection: mockSession,
		historySection: mockHistory
	}
});

const mockStoreNoFolders = configureStore({
	reducer: reducers,
	preloadedState: {
		folder: [],
		sessionSection: mockSession,
		historySection: mockHistory
	}
});

export { mockFolders, mockHistory, mockSession, mockStoreNoFolders };
export default mockStore;
