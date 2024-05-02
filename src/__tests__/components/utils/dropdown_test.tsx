import { render, screen, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import randomNumber from "../../../tools/random_number";
import Dropdown from "../../../components/utils/dropdown/dropdown";
import { iDropdown, iFieldOption } from "../../../interfaces/dropdown";

const mockPreset: iFieldOption = {
	value: randomNumber(),
	label: randomNumber().toString()
};

const mockOptions: Array<iFieldOption> = [];
const mockCallback = jest.fn((e: any) => e);
const mockTag = randomNumber().toString();

for (let i = 0; i < 5; i++) {
	mockOptions.push({
		value: randomNumber(),
		label: randomNumber().toString()
	});
}

const props: iDropdown = {
	tag: mockTag,
	preset: mockPreset,
	options: mockOptions,
	onCallback: mockCallback
};

afterEach(() => {
	jest.clearAllMocks();
});

describe("Test <Dropdown />", () => {
	test("Shows the 'preset' as label", () => {
		render(<Dropdown {...props} />);

		const dropdown = screen.getByRole("menu");

		// Check the dropdown feature itself
		let selectedLabel = within(dropdown).getByText(mockPreset.label);
		expect(selectedLabel).toBeInTheDocument();
	});

	test("Initial render ok, no options list visible yet", () => {
		render(<Dropdown {...props} />);

		const dropdown = screen.getByRole("menu");
		let optionsList = within(dropdown).queryByRole("list");

		expect(optionsList).not.toBeInTheDocument();
	});

	test("Clicking the dropdown shows the menu with all 'options' prop listed", () => {
		render(<Dropdown {...props} />);
		let dropdown = screen.getByRole("menu");
		let selectedLabel = within(dropdown).getByText(mockPreset.label);

		fireEvent.click(selectedLabel);

		let optionsList: any = within(dropdown).getByRole("list");

		mockOptions.forEach((option) => {
			optionsList = within(dropdown).getByRole("list");
			const target = within(optionsList).getByText(option.label, {
				selector: "button"
			});
			expect(target).toBeInTheDocument();
		});
	});

	test("Clicking an option hides the list and triggers 'onCallback' prop", () => {
		render(<Dropdown {...props} />);
		const dropdown = screen.getByRole("menu");
		let selectedLabel = within(dropdown).getByText(mockPreset.label);

		fireEvent.click(selectedLabel);

		let optionsList: any = within(dropdown).getByRole("list");

		mockOptions.forEach((option) => {
			optionsList = within(dropdown).getByRole("list");
			let target = within(optionsList).getByText(option.label, {
				selector: "button"
			});

			fireEvent.click(target);

			optionsList = within(dropdown).queryByRole("list");
			expect(optionsList).not.toBeInTheDocument();
			expect(mockCallback).toHaveBeenCalledWith({
				selected: option.value
			});

			// Prepare for next loop
			selectedLabel = within(dropdown).getByText(option.label);
			fireEvent.click(selectedLabel);
		});
	});

	test("Clicking outside options menu will hide it", () => {
		render(<Dropdown {...props} />);
		const dropdown = screen.getByRole("menu");
		let selectedLabel = within(dropdown).getByText(mockPreset.label);

		fireEvent.click(selectedLabel);

		let optionsList: any = within(dropdown).getByRole("list");
		// Clicking outside the dropdown will hide its menu
		fireEvent.click(window);
		optionsList = within(dropdown).queryByRole("list");
		expect(optionsList).not.toBeInTheDocument();
	});
});
