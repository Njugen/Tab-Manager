import { render, screen, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CircleButton from "../../../components/utils/circle_button";
import randomNumber from "../../../tools/random_number";

const mockCallback = jest.fn();
const mockTestId = randomNumber();
const mockChild = <p data-testid={mockTestId}></p>;

describe("Test <CircleButton />", () => {
	test("There is a child component in the button", () => {
		render(
			<CircleButton onClick={mockCallback} disabled={false}>
				{mockChild}
			</CircleButton>
		);

		const button = screen.getByRole("button");
		const child = within(button).getByTestId(mockTestId);

		expect(child).toBeVisible();
	});

	test("Clicking enabled button triggers 'onClick' callback", () => {
		render(
			<CircleButton onClick={mockCallback} disabled={false}>
				{mockChild}
			</CircleButton>
		);

		const button = screen.getByRole("button");

		fireEvent.click(button);
		expect(mockCallback).toHaveBeenCalled();
	});

	test("Clicking disabled button does not trigger 'onClick' callback", () => {
		render(
			<CircleButton onClick={mockCallback} disabled={true}>
				{mockChild}
			</CircleButton>
		);

		const button = screen.getByRole("button");

		fireEvent.click(button);
		expect(mockCallback).not.toHaveBeenCalled();
	});
});
