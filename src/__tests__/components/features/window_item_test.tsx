import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import TextIconButton from "../../../components/utils/text_icon_button";
import { Provider } from "react-redux";
import { store } from "../../../redux/reducers";
import WindowItem from "../../../components/features/window_item";
import { iTabItem } from "../../../interfaces/tab_item";
import { iWindowItem } from "../../../interfaces/window_item";

import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux";
import thunk from "redux-thunk";

const mockWindow: iWindowItem = {
    id: randomNumber(),
    tabs: [],
    tabsCol: 2
}

const mockMarkTabFn = jest.fn((tabId: number, checked: boolean): void | undefined => {});
const mockEditTabFn = jest.fn((tabId: number): void | undefined => {})
const mockOnCloseFn = jest.fn((tabId: number): void | undefined => {})

// Set up tabs
for(let i = 0; i < 10; i++){
    mockWindow.tabs.push({
        id: randomNumber(),
        label: randomNumber().toString(),
        url: `https://${randomNumber()}.com`,
        marked: false,
        onMark: mockMarkTabFn,
        onEdit: mockEditTabFn,
        onClose: mockOnCloseFn
    });
}

const mockCloseWindowFn = jest.fn((id: number): void => {})
chrome.tabs.remove = jest.fn((tabId: number|number[]): Promise<void> => new Promise((res, rej) => {}));

describe("Test <TextIconButton>", () => {
    test("Only editable tab is shown when no preset tabs", () => {
        render(
            <Provider store={store}>
                <WindowItem id={mockWindow.id} tabs={[]} />
            </Provider>
        )

        const tablist = screen.getByRole("list");
        const listItems = within(tablist).getAllByRole("listitem");
        const textfield = within(listItems[0]).getByRole("textbox");

        expect(tablist).toBeVisible();
        expect(listItems.length).toEqual(1);
        expect(textfield).toBeInTheDocument();
    });

    test("preset tabs renders ok and no editable tab", () => {
        render(
            <Provider store={store}>
                <WindowItem {...mockWindow} />
            </Provider>
        )

        const tablist = screen.getByRole("list");
        const listItems = within(tablist).queryAllByRole("listitem");

        listItems.forEach((item) => {
            // Textfield is not in this list item (tab)
            const textfield = within(item).queryByRole("textbox");
            expect(textfield).not.toBeInTheDocument();
        })
        
        // Tab order matches those defined in the mock
        mockWindow.tabs.forEach((tab, i) => {
            const link = within(listItems[i]).getByRole("link");
            expect(link).toHaveTextContent(tab.label);
        })
    });

    describe("test window settings", () => {
        test("expand/collapse buttons work", () => {
            render(
                <Provider store={store}>
                        <WindowItem {...mockWindow} />
                </Provider>
            )

            let expandButton: HTMLElement | null = screen.queryByTestId("expand-icon");
            let collapseButton: HTMLElement | null = screen.getByTestId("collapse-icon");
            expect(expandButton).not.toBeInTheDocument();
            expect(collapseButton).toBeInTheDocument();

            fireEvent.click(collapseButton);
            expandButton = screen.getByTestId("expand-icon");
            collapseButton = screen.queryByTestId("collapse-icon");
            expect(expandButton).toBeInTheDocument();
            expect(collapseButton).not.toBeInTheDocument();

            fireEvent.click(expandButton);
            expandButton = screen.queryByTestId("expand-icon");
            collapseButton = screen.getByTestId("collapse-icon");
            expect(expandButton).not.toBeInTheDocument();
            expect(collapseButton).toBeInTheDocument();
        })
        test("close window button is hidden when editing is disabled", () => {
            render(
                <Provider store={store}>
                    <WindowItem {...mockWindow} onDelete={mockCloseWindowFn} disableEdit={true} />
                </Provider>
            )
    
            const trashButton = screen.queryByTestId("trash-icon");
            expect(trashButton).not.toBeInTheDocument();
           // fireEvent.click(trashButton);
           // expect(mockCloseWindowFn).toHaveBeenCalledWith(mockWindow.id);
        });

        test("close window button is visible and works when enabled", () => {
            render(
                <Provider store={store}>
                    <WindowItem {...mockWindow} onDelete={mockCloseWindowFn} disableEdit={false} />
                </Provider>
            )
    
            const trashButton = screen.getByTestId("trash-icon");
            expect(trashButton).toBeInTheDocument()
            fireEvent.click(trashButton);
            expect(mockCloseWindowFn).toHaveBeenCalledWith(mockWindow.id);
        })

        test("Tab options are hidden when disabled through window props", () => {
            render(
                <Provider store={store}>
                    <WindowItem {...mockWindow} />
                </Provider>
            )

            const tablist = screen.getByRole("list");
            const listItems = within(tablist).getAllByRole("listitem");

            listItems.forEach((tab, i) => {
                const editButton = within(tab).queryByTestId("pen-icon");
                const checkbox = within(tab).queryByTestId("checkbox");
                const closeButton = within(tab).queryByTestId("close-light-icon");

                expect(editButton).not.toBeInTheDocument();
                expect(checkbox).not.toBeInTheDocument();
                expect(closeButton).not.toBeInTheDocument();
            })
        })

        test("Show textfield when pen icon is clicked, and hides when blurred", () => {
            render(
                <Provider store={store}>
                    <WindowItem {...mockWindow} disableEditTab={false} />
                </Provider>
            )

            let tablist = screen.getByRole("list");
            let listItems = within(tablist).getAllByRole("listitem");

            listItems.forEach((tab, i) => {
                let editableTab = screen.queryByRole("textbox");
                expect(editableTab).not.toBeInTheDocument()

                const editButton = within(tab).getByTestId("pen-icon");
                fireEvent.click(editButton);
                
                editableTab = screen.getByRole("textbox");
                expect(editableTab).toBeInTheDocument();
                expect(editableTab).toHaveFocus();

                const mockNewValue = `https://${randomNumber().toString()}.com`;
                fireEvent.change(editableTab, { target: { value: mockNewValue } })
                fireEvent.blur(editableTab);
            })
        })

        test("Marking tabs will add/remove checkbox mark of affected tabs", () => {
            render(
                <Provider store={store}>
                    <WindowItem {...mockWindow} disableMarkTab={false} />
                </Provider>
            )

            let tablist = screen.getByRole("list");
            let listItems = within(tablist).getAllByRole("listitem");

            listItems.forEach((tab, i) => {
                let checkbox = within(tab).getByTestId("checkbox");
                let checkedMark = within(checkbox).queryByTestId("checked-icon");

                expect(checkedMark).not.toBeInTheDocument();
                fireEvent.click(checkbox);

                checkbox = within(tab).getByTestId("checkbox");
                checkedMark = within(checkbox).queryByTestId("checked-icon");

                expect(checkedMark).toBeInTheDocument();
                fireEvent.click(checkbox);

                checkbox = within(tab).getByTestId("checkbox");
                checkedMark = within(checkbox).queryByTestId("checked-icon");

                expect(checkedMark).not.toBeInTheDocument();
            })
        })

        test("Closing tabs triggers tab removal api", () => {
            render(
                <Provider store={store}>
                    <WindowItem {...mockWindow} disableDeleteTab={false} />
                </Provider>
            )

            let tablist = screen.getByRole("list");
            let listItems = within(tablist).getAllByRole("listitem");

            listItems.forEach((tab, i) => {
             
                let closeButton = within(tab).getByTestId("close-light-icon");
                fireEvent.click(closeButton);

                expect(chrome.tabs.remove).toHaveBeenCalledWith(mockWindow.tabs[i].id);
            })
        });

        test("Add tab button is visible and adds editable tab once clicked", () => {
            render(
                <Provider store={store}>
                    <WindowItem {...mockWindow} disableAddTab={false} disableEdit={false} />
                </Provider>
            )

            const addTabButton = screen.getByText("New tab");
            fireEvent.click(addTabButton);

            // Check the tab list and check whether or not a textfield shows up as the last item
            let tablist = screen.getByRole("list");
            let listItems = within(tablist).getAllByRole("listitem");
            const lastItem = listItems[listItems.length-1];

            const textfield = within(lastItem).queryByRole("textbox");
            expect(textfield).toBeInTheDocument();
        });

        test("Delete tab button becomes available when at least 1 tab is marked. once clicked, all tabs get unmarked", () => {
            render(
                <Provider store={store}>
                    <WindowItem {...mockWindow} disableMarkTab={false} disableEdit={false} />
                </Provider>
            )

            let deleteTabsButton = screen.queryByText("Delete tabs");
            expect(deleteTabsButton).not.toBeInTheDocument();

            let tablist = screen.getByRole("list");
            let listItems = within(tablist).getAllByRole("listitem");

            listItems.forEach((tab, i) => {
                const checkbox = within(tab).getByTestId("checkbox");
                fireEvent.click(checkbox)

                const checkedMark = within(checkbox).queryByTestId("checked-icon");

                expect(checkedMark).toBeInTheDocument();
            });

            deleteTabsButton = screen.getByText("Delete tabs");
            expect(deleteTabsButton).toBeInTheDocument();

            fireEvent.click(deleteTabsButton);


            // Cannot make more assertions in with unit tests.
            // This part requires a redux store, so save this for integration tests...
        
        });
    })
    
});