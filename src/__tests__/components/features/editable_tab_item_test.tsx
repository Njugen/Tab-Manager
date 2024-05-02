import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import randomNumber from "../../../tools/random_number";
import EditableTabItem from "../../../components/features/editable_tab_item";
import { store } from "../../../redux-toolkit/store";
import { Provider } from "react-redux";

let mockFn = jest.fn();

afterEach(() => {
	jest.clearAllMocks();
	cleanup();
});

const mockTabId = randomNumber();
const mockWindowId = randomNumber();
const mockPreset = `https://${randomNumber().toString()}.com`;
const mockNewValue = `https://${randomNumber().toString()}.com`;

describe("Test <EditableTabItem>", () => {
	const commonRender = () => {
		render(
			<Provider store={store}>
				<EditableTabItem windowId={mockWindowId} onStop={mockFn} />
			</Provider>
		);
	};

	describe("When initial value is 'https://'", () => {
		test("Initial value is 'https://'", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			expect(textfield).toHaveValue("https://");
		});

		test("Bluring does not trigger 'onStop' callback", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			// Test blur
			fireEvent.blur(textfield);
			expect(mockFn).not.toHaveBeenCalled();
		});

		test("Pressing Enter does not trigger 'onStop' callback", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			// Test press enter
			fireEvent.keyDown(textfield, { key: "Enter" });
			expect(mockFn).not.toHaveBeenCalled();
		});

		test("Value remains 'https://' after bluring", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			// Test blur
			fireEvent.blur(textfield);

			// Value remains the same
			textfield = screen.getByRole("textbox");
			expect(textfield).toHaveValue("https://");
		});

		test("Value remains 'https://' when pressing Enter", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			// Test press enter
			fireEvent.keyDown(textfield, { key: "Enter" });

			// Value remains the same
			textfield = screen.getByRole("textbox");
			expect(textfield).toHaveValue("https://");
		});

		test("Error message shows up when field is blurred", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			// Test blur
			fireEvent.blur(textfield);

			let errfield = screen.queryByTestId("field-error");
			expect(errfield).toBeInTheDocument();
		});

		test("Error message shows up when pressing enter", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			// Test press enter
			fireEvent.keyDown(textfield, { key: "Enter" });

			let errfield = screen.queryByTestId("field-error");
			expect(errfield).toBeInTheDocument();
		});

		test("Trigger 'onStop' callback and hides error message when blurred with valid url", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			let errfield = screen.queryByTestId("field-error");

			// Change to new value
			fireEvent.change(textfield, { target: { value: mockNewValue } });
			fireEvent.blur(textfield);
			expect(textfield).toHaveValue(mockNewValue);
			expect(mockFn).toHaveBeenCalled();
			expect(errfield).not.toBeInTheDocument();
		});

		test("Trigger 'onStop' callback and hides error message when hitting enter with valid url", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			let errfield = screen.queryByTestId("field-error");

			// Change to new value
			fireEvent.change(textfield, { target: { value: mockNewValue } });
			fireEvent.keyDown(textfield, { key: "Enter" });
			expect(textfield).toHaveValue(mockNewValue);
			expect(mockFn).toHaveBeenCalled();
			expect(errfield).not.toBeInTheDocument();
		});

		test("Does not trigger 'onStop' callback and show error when blurring with invalid url", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			// Change to invalid value
			fireEvent.change(textfield, {
				target: { value: randomNumber().toString() }
			});
			fireEvent.blur(textfield);
			let errfield = screen.queryByTestId("field-error");
			expect(errfield).toBeInTheDocument();
		});

		test("Does not trigger 'onStop' callback and show error when hitting enter with invalid url", async () => {
			commonRender();

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			// Change to invalid value
			fireEvent.change(textfield, {
				target: { value: randomNumber().toString() }
			});
			fireEvent.keyDown(textfield, { key: "Enter" });
			let errfield = screen.queryByTestId("field-error");
			expect(errfield).toBeInTheDocument();
		});
	});

	describe("When initial value is a valid url", () => {
		test("Preset value matches the component's 'url' prop", async () => {
			render(
				<Provider store={store}>
					<EditableTabItem
						windowId={mockWindowId}
						id={mockTabId}
						preset={mockPreset}
						onStop={mockFn}
					/>
				</Provider>
			);

			let textfield = screen.getByRole("textbox");
			expect(textfield).toHaveValue(mockPreset);
		});

		test("Blurring triggers 'onStop' callback", async () => {
			render(
				<Provider store={store}>
					<EditableTabItem
						windowId={mockWindowId}
						id={mockTabId}
						preset={mockPreset}
						onStop={mockFn}
					/>
				</Provider>
			);

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			// Test blur
			fireEvent.blur(textfield);
			expect(mockFn).toHaveBeenCalled();
		});

		test("Pressing Enter triggers 'onStop' callback", async () => {
			render(
				<Provider store={store}>
					<EditableTabItem
						windowId={mockWindowId}
						id={mockTabId}
						preset={mockPreset}
						onStop={mockFn}
					/>
				</Provider>
			);

			let textfield = screen.getByRole("textbox");
			await waitFor(() => expect(textfield).toHaveFocus(), {
				timeout: 1000
			});

			// Test press enter
			fireEvent.keyDown(textfield, { key: "Enter" });
			expect(mockFn).toHaveBeenCalled();
		});
	});
});
