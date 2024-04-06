import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { store } from "../../../redux/reducers";
import AdvancedSearchBar from "../../../components/features/advanced_search_bar/advanced_search_bar";
import { Provider } from "react-redux";
import iCurrentSessionState from "../../../interfaces/states/current_session_state";
import { setUpWindowsAction } from "../../../redux/actions/current_session_actions";
import { setUpTabsAction } from "../../../redux/actions/history_settings_actions";
import { iTabItem } from "../../../interfaces/tab_item";


jest.mock("../../../redux/mocked_hooks");
jest.useFakeTimers();
jest.setTimeout(10000);

const mockCurrentSession: iCurrentSessionState = {
    windows: [
        {
            focused: false,
            alwaysOnTop: false,
            incognito: false,
            id: 0,
            tabs: []
        },
    ],
    markedWindows: [],
    markedTabs: [],
    tabsSort: "asc",
    viewMode: "grid"
} 

const mockTabs = [
    { url: "http://fz.se", title: "Fragzone" },
    { url: "http://aftonbladet.se", title: "Aftonbladet" },
    { url: "http://fragment.se", title: "Fragment" },
    { url: "http://aftis.fi", title: "Aftis" },
    { url: "http://vasabladet.fi", title: "Vasabladet" }
];

mockTabs.forEach((tab, i) => {
    const temp: Array<chrome.tabs.Tab> | undefined = mockCurrentSession.windows[0].tabs;

    if(temp){
        temp.push({
            id: i,
            index: i,
            title: tab.title,
            url: tab.url,
            pinned: false,
            highlighted: false,
            active: false,
            incognito: false,
            windowId: 1,
            selected: false,
            discarded: false,
            autoDiscardable: false,
            groupId: 0
        });
        
        mockCurrentSession.windows[0].tabs = temp as Array<chrome.tabs.Tab>;
    }
})

const historyTabs: Array<chrome.history.HistoryItem> = [
    { id: "0", title: "Helsingfors universitet" }, 
    { id: "1", title: "Stockholms universitet" },
    { id: "2", title: "Åbos universitet" },
    { id: "3", title: "Hufvudstadsbladet" }
];

beforeEach(() => {
    store.dispatch(setUpWindowsAction(mockCurrentSession.windows));
    store.dispatch(setUpTabsAction(historyTabs));
})

afterEach(() => {
    jest.clearAllMocks();
 });

describe("Search bar", () => {
    test("There is a preset search term/phrase", () => {
      render(
        <Provider store={store}>
            <AdvancedSearchBar /> 
        </Provider>
      );

      const searchField = screen.getByTestId("search-field");
      expect(searchField).toHaveValue();
    })

    test("No search results area shown per default", () => {
        render(
          <Provider store={store}>
              <AdvancedSearchBar /> 
          </Provider>
        );

        jest.runAllTimers();
  
        const searchResultsArea = screen.queryByTestId("search-results-area");
        expect(searchResultsArea).not.toBeInTheDocument()
    });

    test("Search field and search results works. Hides when blurred", () => {
        const { rerender } = render(
            <Provider store={store}>
                <AdvancedSearchBar /> 
            </Provider>
        );

        let searchResultsArea = screen.queryByTestId("search-results-area");
        expect(searchResultsArea).not.toBeInTheDocument();
        
        let searchField: HTMLInputElement = screen.getByTestId("search-field");
        fireEvent.click(searchField);

        jest.runAllTimers();
       
        rerender(
            <Provider store={store}>
                <AdvancedSearchBar /> 
            </Provider>
        );

        searchResultsArea = screen.getByTestId("search-results-area");
        expect(searchResultsArea).toBeInTheDocument();

        let tabs = screen.queryAllByTestId("tab-item");
        expect(tabs.length).toEqual(0);

        const searchTerm = "bladet";

        fireEvent.focus(searchField);

        fireEvent.change(searchField, {
            target: {
                value: searchTerm
            }
        });

        tabs = screen.queryAllByTestId("tab-item");
        expect(tabs.length).toEqual(3);

        expect(searchResultsArea).toHaveTextContent("Aftonbladet");
        expect(searchResultsArea).toHaveTextContent("Vasabladet");

        searchField = screen.getByTestId("search-field");
        expect(searchField.value).toBe(searchTerm);

        fireEvent.change(searchField, {
            target: {
                value: ""
            }
        });

        tabs = screen.queryAllByTestId("tab-item");
        expect(tabs.length).toEqual(0);

        fireEvent.focus(searchField)

        fireEvent.change(searchField, {
            target: {
                value: "univer"
            }
        });

        tabs = screen.queryAllByTestId("tab-item");
        expect(tabs.length).toEqual(3);

        expect(searchResultsArea).toHaveTextContent("Helsingfors universitet");
        expect(searchResultsArea).toHaveTextContent("Stockholms universitet");
        expect(searchResultsArea).toHaveTextContent("Åbos universitet");

        fireEvent.click(searchResultsArea);

        searchResultsArea = screen.queryByTestId("search-results-area");
        expect(searchResultsArea).not.toBeInTheDocument();
    });

    test("X (close tab) button is visible and works for currently opened tabs.", () => {
        const { rerender } = render(
            <Provider store={store}>
                <AdvancedSearchBar /> 
            </Provider>
        );

        let searchField: HTMLInputElement = screen.getByTestId("search-field");
        fireEvent.click(searchField);

        let searchResultsArea = screen.getByTestId("search-results-area");
        expect(searchResultsArea).toBeInTheDocument();

        const searchTerm = "bladet";

        fireEvent.focus(searchField);

        fireEvent.change(searchField, {
            target: {
                value: searchTerm
            }
        });

       const closeButtons = screen.getAllByTestId("generic-icon-button-close_light");
       expect(closeButtons.length).toEqual(2);
    });
});