import { render, screen, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Checkbox from "../../../components/utils/checkbox";

const mockCallback = jest.fn();

describe("Test <Checkbox />", () => {
	test("Can be checked", () => {
		render(<Checkbox checked={false} onCallback={mockCallback} />);

		// checkbox exists
		let checkbox: HTMLInputElement = screen.getByRole("checkbox");

		fireEvent.click(checkbox);
		expect(checkbox.defaultChecked).toBeTruthy();
	});

	test("Can be unchecked", () => {
		render(<Checkbox checked={true} onCallback={mockCallback} />);

		// checkbox exists
		let checkbox: HTMLInputElement = screen.getByRole("checkbox");

		fireEvent.click(checkbox);
		expect(checkbox.defaultChecked).toBeFalsy();
	});

	test("can be checked -> unchecked -> checked", () => {
		render(<Checkbox checked={true} onCallback={mockCallback} />);

		// checkbox exists
		let checkbox: HTMLInputElement = screen.getByRole("checkbox");
		fireEvent.click(checkbox);
		fireEvent.click(checkbox);

		expect(checkbox.defaultChecked).toBeTruthy();
	});

	test("can be unchecked -> checked -> unchecked", () => {
		render(<Checkbox checked={false} onCallback={mockCallback} />);

		// checkbox exists
		let checkbox: HTMLInputElement = screen.getByRole("checkbox");
		fireEvent.click(checkbox);
		fireEvent.click(checkbox);

		expect(checkbox.defaultChecked).toBeFalsy();
	});
});
