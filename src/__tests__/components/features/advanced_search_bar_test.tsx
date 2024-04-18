import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import CircleButton from '../../../components/utils/circle_button';
import randomNumber from "../../../tools/random_number";
import FormField from "../../../components/utils/form_field";
import Group from "../../../components/utils/group";

import { reducers } from "../../../redux-toolkit/store";
import { configureStore } from "@reduxjs/toolkit";
import { iFolderItem } from "../../../interfaces/folder_item";
import iCurrentSessionState from "../../../interfaces/states/current_session_state";
import iHistoryState from "../../../interfaces/states/history_state";
import { iTabItem } from "../../../interfaces/tab_item";
import { Provider } from "react-redux";
import mockStore from '../../../tools/testing/mock_store';
import AdvancedSearchBar from "../../../components/features/advanced_search_bar/advanced_search_bar";
import { act } from "react-dom/test-utils";

describe("Test <AdvancedSearchBar>", () => {
    test("No results box visible at invocation", () => {
        render(
            <Provider store={mockStore}>
                <AdvancedSearchBar />
            </Provider>
        )

        const resultsBox = screen.queryByTestId("search-results-area");
        expect(resultsBox).not.toBeInTheDocument(); 
    })

    test("Results box shows up when clicking the search button", () => {
        jest.useFakeTimers();

        render(
            <Provider store={mockStore}>
                <AdvancedSearchBar />
            </Provider>
        )

        const textfield = screen.getByRole("textbox");
        fireEvent.click(textfield);

        act(() => {
            jest.runAllTimers();
        });

        const resultsBox = screen.getByTestId("search-results-area");
        expect(resultsBox).toBeInTheDocument(); 
        jest.useRealTimers();
    })

    test("Results box contains no lists if the textfield is empty", () => {
        render(
            <Provider store={mockStore}>
                <AdvancedSearchBar />
            </Provider>
        )

        const textfield = screen.getByRole("textbox");
        fireEvent.click(textfield);

        const resultsBox = screen.getByTestId("search-results-area");
        const lists = within(resultsBox).queryAllByRole("list");

        expect(lists.length).toEqual(0);
    })

    test("Results box is not visible when clicking outside textfield AND results box", () => {
        render(
            <Provider store={mockStore}>
                <AdvancedSearchBar />
            </Provider>
        )

        const textfield = screen.getByRole("textbox");
        fireEvent.click(textfield);

        let resultsBox: any = screen.getByTestId("search-results-area");
        fireEvent.click(resultsBox);

        resultsBox = screen.queryByTestId("search-results-area");
        expect(resultsBox).not.toBeInTheDocument()
    })
    
    test("Writing 'Tab Manager' will only show folders with that phrase in the title", () => {
        const keyword = "Tab Manager";

        render(
            <Provider store={mockStore}>
                <AdvancedSearchBar />
            </Provider>
        )

        const textfield = screen.getByRole("textbox");
        fireEvent.click(textfield);
        fireEvent.change(textfield, { target: { value: keyword } });


        const resultsBox = screen.getByTestId("search-results-area");

        const foldersResults = within(resultsBox).getByTestId("folders-search-result");
        const list = within(foldersResults).getByRole("list");
        const folders = within(list).getAllByTestId("folder-item");

        folders.forEach((folder) => {
            const heading = within(folder).getByRole("heading");
            expect(heading).toHaveTextContent(keyword);
        });
    })

    test("Writing 'Tab Manager' will only show history tabs with that phrase in the title", () => {
        const keyword = "Tab Manager";

        render(
            <Provider store={mockStore}>
                <AdvancedSearchBar />
            </Provider>
        )

        const textfield = screen.getByRole("textbox");
        fireEvent.click(textfield);
        fireEvent.change(textfield, { target: { value: keyword } });

        const resultsBox = screen.getByTestId("search-results-area");

        const historyResults = within(resultsBox).getByTestId("history-tabs-search-result");
        const list = within(historyResults).getByRole("list");
        const tabs = within(list).getAllByRole("listitem");

        tabs.forEach((tab) => {
            expect(tab).toHaveTextContent(keyword);
        });
    })

    test("Writing 'Tab Manager' will only show session tabs with that phrase in the title", () => {
        const keyword = "Tab Manager";

        render(
            <Provider store={mockStore}>
                <AdvancedSearchBar />
            </Provider>
        )

        const textfield = screen.getByRole("textbox");
        fireEvent.click(textfield);
        fireEvent.change(textfield, { target: { value: keyword } });

        const resultsBox = screen.getByTestId("search-results-area");

        const historyResults = within(resultsBox).getByTestId("current-tabs-search-result");
        const list = within(historyResults).getByRole("list");
        const tabs = within(list).getAllByRole("listitem");

        tabs.forEach((tab) => {
            expect(tab).toHaveTextContent(keyword);
        });
    })

    describe("Folder interactions", () => {
        test("There are no warning messages at invocation", () => {
            // @ts-expect-error
            chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                callback({ performanceWarningValue: 5 })
            })

            jest.useFakeTimers();

            render(
                <Provider store={mockStore}>
                    <AdvancedSearchBar />
                </Provider>
            )

            const warningMessage = screen.queryByRole("alert");
            expect(warningMessage).not.toBeInTheDocument();
        })

        test("Attempt at launching a folder where total number of tabs exceeds settings treshold, will trigger a warning", () => {
            // @ts-expect-error
            chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                callback({ performanceWarningValue: 5 })
            })

            jest.useFakeTimers();

            render(
                <Provider store={mockStore}>
                    <AdvancedSearchBar />
                </Provider>
            )

            const textfield = screen.getByRole("textbox");
            fireEvent.click(textfield);
            fireEvent.change(textfield, { target: { value: "Katter" } });

            const resultsBox = screen.getByTestId("search-results-area");

            const foldersResults = within(resultsBox).getByTestId("folders-search-result");
            const list = within(foldersResults).getByRole("list");
            const folders = within(list).getAllByTestId("folder-item");

            const targetFolder = folders[0];

            const openButton = within(targetFolder).getByTestId("open-browser-icon");
            fireEvent.click(openButton, { bubbles: true });

            const openFolderOptionsMenu = within(targetFolder).getByTestId("open-folder-options");

            let optionsButton = within(openFolderOptionsMenu).getAllByRole("button");
            fireEvent.click(optionsButton[0], { bubbles: true });

            const warningMessage = screen.getByRole("alert");
            expect(warningMessage).toBeInTheDocument();
        })

        test("Attempt at launching a folder where total number of tabs does not exceeds settings treshold, will not trigger a warning", () => {
            // @ts-expect-error
            chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                callback({ performanceWarningValue: 30 })
            })

            jest.useFakeTimers();

            render(
                <Provider store={mockStore}>
                    <AdvancedSearchBar />
                </Provider>
            )

            const textfield = screen.getByRole("textbox");
            fireEvent.click(textfield);
            fireEvent.change(textfield, { target: { value: "Katter" } });

            const resultsBox = screen.getByTestId("search-results-area");

            const foldersResults = within(resultsBox).getByTestId("folders-search-result");
            const list = within(foldersResults).getByRole("list");
            const folders = within(list).getAllByTestId("folder-item");

            const targetFolder = folders[0];

            const openButton = within(targetFolder).getByTestId("open-browser-icon");
            fireEvent.click(openButton, { bubbles: true });

            const openFolderOptionsMenu = within(targetFolder).getByTestId("open-folder-options");

            let optionsButton = within(openFolderOptionsMenu).getAllByRole("button");
            fireEvent.click(optionsButton[0], { bubbles: true });

            const warningMessage = screen.queryByRole("alert");
            expect(warningMessage).not.toBeInTheDocument();
        })

        test("Cancelling a warning will hide it", () => {
            // @ts-expect-error
            chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                callback({ performanceWarningValue: 5 })
            })

            render(
                <Provider store={mockStore}>
                    <AdvancedSearchBar />
                </Provider>
            )

            const textfield = screen.getByRole("textbox");
            fireEvent.click(textfield);
            fireEvent.change(textfield, { target: { value: "Katter" } });

            const resultsBox = screen.getByTestId("search-results-area");

            const foldersResults = within(resultsBox).getByTestId("folders-search-result");
            const list = within(foldersResults).getByRole("list");
            const folders = within(list).getAllByTestId("folder-item");

            const targetFolder = folders[0];

            const openButton = within(targetFolder).getByTestId("open-browser-icon");
            fireEvent.click(openButton, { bubbles: true });

            const openFolderOptionsMenu = within(targetFolder).getByTestId("open-folder-options");

            let optionsButton = within(openFolderOptionsMenu).getAllByRole("button");
            fireEvent.click(optionsButton[0], { bubbles: true });

            const warningMessage = screen.getByRole("alert");
            const cancelButton = within(warningMessage).getByTestId("alert-cancel-button");

            fireEvent.click(cancelButton);
            expect(warningMessage).not.toBeInTheDocument()

        })

        test("Proceeding/opening a window through warning message will trigger equivalent chrome function", () => {
            // @ts-expect-error
            chrome.windows.create = jest.fn((): void => {})

            // @ts-expect-error
            chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                callback({ performanceWarningValue: 5 })
            })

            render(
                <Provider store={mockStore}>
                    <AdvancedSearchBar />
                </Provider>
            )

            const textfield = screen.getByRole("textbox");
            fireEvent.click(textfield);
            fireEvent.change(textfield, { target: { value: "Katter" } });

            const resultsBox = screen.getByTestId("search-results-area");

            const foldersResults = within(resultsBox).getByTestId("folders-search-result");
            const list = within(foldersResults).getByRole("list");
            const folders = within(list).getAllByTestId("folder-item");

            const targetFolder = folders[0];

            const openButton = within(targetFolder).getByTestId("open-browser-icon");
            fireEvent.click(openButton, { bubbles: true });

            const openFolderOptionsMenu = within(targetFolder).getByTestId("open-folder-options");

            let optionsButton = within(openFolderOptionsMenu).getAllByRole("button");
            fireEvent.click(optionsButton[0], { bubbles: true });

            const warningMessage = screen.getByRole("alert");
            const proceedButton = within(warningMessage).getByTestId("alert-proceed-button");

            fireEvent.click(proceedButton);
            expect(chrome.windows.create).toHaveBeenCalled();

        });
        
        test("Proceeding/opening a window through warning message will hide it", () => {
            // @ts-expect-error
            chrome.storage.local.get = jest.fn((keys: string | string[] | { [key: string]: any; } | null, callback: (items: { [key: string]: any; }) => void): void => {
                callback({ performanceWarningValue: 5 })
            })

            render(
                <Provider store={mockStore}>
                    <AdvancedSearchBar />
                </Provider>
            )

            const textfield = screen.getByRole("textbox");
            fireEvent.click(textfield);
            fireEvent.change(textfield, { target: { value: "Katter" } });

            const resultsBox = screen.getByTestId("search-results-area");

            const foldersResults = within(resultsBox).getByTestId("folders-search-result");
            const list = within(foldersResults).getByRole("list");
            const folders = within(list).getAllByTestId("folder-item");

            const targetFolder = folders[0];

            const openButton = within(targetFolder).getByTestId("open-browser-icon");
            fireEvent.click(openButton, { bubbles: true });

            const openFolderOptionsMenu = within(targetFolder).getByTestId("open-folder-options");

            let optionsButton = within(openFolderOptionsMenu).getAllByRole("button");
            fireEvent.click(optionsButton[0], { bubbles: true });

            const warningMessage = screen.getByRole("alert");
            const proceedButton = within(warningMessage).getByTestId("alert-proceed-button");

            fireEvent.click(proceedButton);
            expect(warningMessage).not.toBeInTheDocument()

        })
    })
});