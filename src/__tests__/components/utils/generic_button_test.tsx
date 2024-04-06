import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import GenericButton from "../../../components/utils/generic_button";

const mockChild = <span data-testid="mock-child"></span>;
const mockFn = jest.fn()

describe("Test <GenericButton>", () => {
    test("button works ok ok", () => {
        render(
            <GenericButton onClick={mockFn}>
                {mockChild}
            </GenericButton>
        );

        const button = screen.getByRole("button");
        const child = within(button).getByTestId("mock-child");

        expect(child).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalled();
    })
});