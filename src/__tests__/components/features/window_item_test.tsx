import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import randomNumber from "../../../tools/random_number";
import { Provider } from "react-redux";
import { store } from "../../../redux-toolkit/store";
import WindowItem from "../../../components/features/window_item";
import { iTabItem } from "../../../interfaces/tab_item";
import { iWindowItem } from "../../../interfaces/window_item";
import tBrowserTabId from "../../../interfaces/types/browser_tab_id";

const mockWindow: iWindowItem = {
	id: randomNumber(),
	tabs: [],
	tabsCol: 2
};

const mockMarkTabFn = jest.fn((tabId: tBrowserTabId, checked: boolean): void | undefined => {});
const mockEditTabFn = jest.fn((tabId: tBrowserTabId): void | undefined => {});
const mockOnCloseFn = jest.fn((tabId: tBrowserTabId): void | undefined => {});

// Set up tabs
for (let i = 0; i < 10; i++) {
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

const mockCloseWindowFn = jest.fn((id: number | number[]): void => {});
chrome.tabs.remove = jest.fn(
	(tabId: number | number[]): Promise<void> => new Promise((res, rej) => {})
);

afterEach(() => {
	jest.clearAllMocks();
	cleanup();
});

describe("Test <WindowItem>", () => {
	test("Only editable tab is shown when no preset tabs", () => {
		render(
			<Provider store={store}>
				<WindowItem id={mockWindow.id} tabs={[]} />
			</Provider>
		);

		const tablist = screen.getByRole("list");
		const listItems = within(tablist).getAllByRole("listitem");
		const textfield = within(listItems[0]).getByRole("textbox");

		expect(textfield).toBeInTheDocument();
	});

	test("initial preset tabs renders ok", () => {
		render(
			<Provider store={store}>
				<WindowItem {...mockWindow} />
			</Provider>
		);

		const tablist = screen.getByRole("list");
		const listItems = within(tablist).queryAllByRole("listitem");

		// Tab order matches those defined in the mock
		mockWindow.tabs.forEach((tab, i) => {
			const link = within(listItems[i]).getByRole("link");
			expect(link).toHaveTextContent(tab.label);
		});
	});

	test("no textfield when invoking with preset tabs", () => {
		render(
			<Provider store={store}>
				<WindowItem {...mockWindow} />
			</Provider>
		);

		const tablist = screen.getByRole("list");
		const listItems = within(tablist).queryAllByRole("listitem");

		listItems.forEach((item) => {
			// Textfield is not in this list item (tab)
			const textfield = within(item).queryByRole("textbox");
			expect(textfield).not.toBeInTheDocument();
		});
	});

	describe("test window settings", () => {
		test("expand button becomes visible when clicking collapse", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} />
				</Provider>
			);

			let expandButton: HTMLElement | null = screen.queryByTestId("expand-icon");
			let collapseButton: HTMLElement | null = screen.getByTestId("collapse-icon");

			fireEvent.click(collapseButton);
			expandButton = screen.getByTestId("expand-icon");
			expect(expandButton).toBeInTheDocument();
		});

		test("collapse button is hidden once clicked", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} />
				</Provider>
			);

			let collapseButton: HTMLElement | null = screen.getByTestId("collapse-icon");

			fireEvent.click(collapseButton);
			collapseButton = screen.queryByTestId("collapse-icon");

			expect(collapseButton).not.toBeInTheDocument();
		});

		test("close window button is hidden when editing is disabled", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} onDelete={mockCloseWindowFn} disableEdit={true} />
				</Provider>
			);

			const trashButton = screen.queryByTestId("trash-icon");
			expect(trashButton).not.toBeInTheDocument();
		});

		test("close window button is visible", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} onDelete={mockCloseWindowFn} disableEdit={false} />
				</Provider>
			);

			const trashButton = screen.getByTestId("trash-icon");
			expect(trashButton).toBeInTheDocument();
		});

		test("close window button calls callback when clicked and enabled", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} onDelete={mockCloseWindowFn} disableEdit={false} />
				</Provider>
			);

			const trashButton = screen.getByTestId("trash-icon");
			fireEvent.click(trashButton);
			expect(mockCloseWindowFn).toHaveBeenCalledWith(mockWindow.id);
		});

		test.each([
			["Edit", "pen-icon"],
			["Checkbox", "checkbox"],
			["Close", "close-light-icon"]
		])("%j is hidden when disabled through props", (label, testId) => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} />
				</Provider>
			);

			const tablist = screen.getByRole("list");
			const listItems = within(tablist).getAllByRole("listitem");

			listItems.forEach((tab, i) => {
				const button = within(tab).queryByTestId(testId);
				expect(button).not.toBeInTheDocument();
			});
		});

		test("Show textfield and focus it when pen icon is clicked (enabled through props)", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} disableEditTab={false} />
				</Provider>
			);

			let tablist = screen.getByRole("list");
			let listItems = within(tablist).getAllByRole("listitem");

			listItems.forEach((tab, i) => {
				let editableTab = screen.queryByRole("textbox");

				const editButton = within(tab).getByTestId("pen-icon");
				fireEvent.click(editButton);

				editableTab = screen.getByRole("textbox");
				expect(editableTab).toBeInTheDocument();
			});
		});

		test("Marking multiple tabs is successful", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} disableMarkTab={false} />
				</Provider>
			);

			let tablist = screen.getByRole("list");
			let listItems = within(tablist).getAllByRole("listitem");

			listItems.forEach((tab, i) => {
				let checkbox: HTMLInputElement = within(tab).getByTestId("checkbox");

				fireEvent.click(checkbox);

				expect(checkbox.defaultChecked).toBeTruthy();
			});
		});

		test("Clicking mark button on marked tabs will remove checkbox mark of affected tabs", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} disableMarkTab={false} />
				</Provider>
			);

			let tablist = screen.getByRole("list");
			let listItems = within(tablist).getAllByRole("listitem");

			listItems.forEach((tab, i) => {
				let checkbox: HTMLInputElement = within(tab).getByTestId("checkbox");

				fireEvent.click(checkbox);
				fireEvent.click(checkbox);

				expect(checkbox.defaultChecked).toBeFalsy();
			});
		});

		test("Closing tabs triggers tab removal relevant callback prop", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} disableDeleteTab={false} />
				</Provider>
			);

			let tablist = screen.getByRole("list");
			let listItems = within(tablist).getAllByRole("listitem");

			listItems.forEach((tab, i) => {
				let closeButton = within(tab).getByTestId("close-light-icon");
				fireEvent.click(closeButton);

				expect(chrome.tabs.remove).toHaveBeenCalledWith(mockWindow.tabs[i].id);
			});
		});

		test("'New tab' button is visible when adding tab and editing tab permissions are in place", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} disableAddTab={false} disableEdit={false} />
				</Provider>
			);

			const addTabButton = screen.getByText("New tab");

			expect(addTabButton).toBeInTheDocument();
		});

		test("Add tab button is always invisible if number of tabs is 0", () => {
			render(
				<Provider store={store}>
					<WindowItem
						{...mockWindow}
						tabs={[] as Array<iTabItem>}
						disableAddTab={false}
						disableEdit={false}
					/>
				</Provider>
			);

			const addTabButton = screen.queryByText("New tab");
			expect(addTabButton).not.toBeInTheDocument();
		});

		test("Add tab button is always invisible if disableAddTabs is true", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} tabs={[] as Array<iTabItem>} disableAddTab={true} />
				</Provider>
			);

			const addTabButton = screen.queryByText("New tab");
			expect(addTabButton).not.toBeInTheDocument();
		});

		test("Add tab button is always invisible if disableEdit is true", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} tabs={[] as Array<iTabItem>} disableEdit={true} />
				</Provider>
			);

			const addTabButton = screen.queryByText("New tab");
			expect(addTabButton).not.toBeInTheDocument();
		});

		test("Delete tab button is available when at least 1 tab is marked.", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} disableMarkTab={false} disableEdit={false} />
				</Provider>
			);

			let deleteTabsButton = screen.queryByText("Delete tabs");

			let tablist = screen.getByRole("list");
			let listItems = within(tablist).getAllByRole("listitem");

			listItems.forEach((tab, i) => {
				const checkbox = within(tab).getByTestId("checkbox");
				fireEvent.click(checkbox);
			});

			deleteTabsButton = screen.getByText("Delete tabs");
			expect(deleteTabsButton).toBeInTheDocument();
		});

		test("Clicking checkboxes will mark them", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} disableMarkTab={false} disableEdit={false} />
				</Provider>
			);

			let tablist = screen.getByRole("list");
			let listItems = within(tablist).getAllByRole("listitem");

			listItems.forEach((tab, i) => {
				const checkbox: HTMLInputElement = within(tab).getByTestId("checkbox");
				fireEvent.click(checkbox);

				expect(checkbox.defaultChecked).toBeTruthy();
			});
		});

		test("Clicking delete button will trigger onDelete callback (when editing outside folder state context)", () => {
			const tabDeleteFn = jest.fn((ids: Array<tBrowserTabId>) => {});

			render(
				<Provider store={store}>
					<WindowItem
						{...mockWindow}
						disableMarkTab={false}
						disableEdit={false}
						onDeleteTabs={tabDeleteFn}
					/>
				</Provider>
			);

			let tablist = screen.getByRole("list");
			let listItems = within(tablist).getAllByRole("listitem");

			listItems.forEach((tab, i) => {
				const checkbox = within(tab).getByTestId("checkbox");
				fireEvent.click(checkbox, { bubbles: true });
			});

			const availableTabs = mockWindow.tabs.map((tab) => tab.id);

			let deleteTabsButton = screen.getByText("Delete tabs");
			fireEvent.click(deleteTabsButton, { bubbles: true });

			expect(tabDeleteFn).toHaveBeenCalledWith(availableTabs);

			// Cannot make more assertions with unit tests.
			// This part requires a redux store, so save this for integration tests...
		});

		test("Delete tab button is invisible if no tabs are marked", () => {
			render(
				<Provider store={store}>
					<WindowItem {...mockWindow} disableMarkTab={false} disableEdit={false} />
				</Provider>
			);

			let deleteTabsButton = screen.queryByText("Delete tabs");
			expect(deleteTabsButton).not.toBeInTheDocument();
		});
	});
});
