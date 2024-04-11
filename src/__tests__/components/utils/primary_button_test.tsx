import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import PrimaryButton from "../../../components/utils/primary_button/primary_button";

const mockText = randomNumber().toString();
const mockFn = jest.fn();

describe("Test <PrimaryButton>", () => {
    test("Button has text inserted through props", () => {
        render(
            <PrimaryButton text={mockText} disabled={false} onClick={mockFn} />
        )

        const button = screen.getByRole("button");
        const text = within(button).getByText(mockText);
        expect(text).toHaveTextContent(mockText);
    });

    test("Clicking the button triggers callback", () => {
        render(
            <PrimaryButton text={mockText} disabled={false} onClick={mockFn} />
        )

        const button = screen.getByRole("button");

        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalled();
    });

    test("Clicking triggers nothing when disabled", () => {
        render(
            <PrimaryButton text={mockText} disabled={true} onClick={mockFn} />
        )

        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(mockFn).not.toHaveBeenCalled();
    })
    
});