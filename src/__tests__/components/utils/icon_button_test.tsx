import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import FolderControlButton from "../../../components/utils/icon_button/icon_button";

const mockId = randomNumber().toString();
const mockChildren = <p data-testid="mock-component"></p>
const mockFn = jest.fn();

describe("Test <FolderControlButton>", () => {
    test("Shows child component", () => {
        render(
            <FolderControlButton id={mockId} disabled={false} onClick={mockFn}>
                {mockChildren}
            </FolderControlButton>
        )
    
        const button = screen.getByRole("button");
        const children = within(button).getByTestId("mock-component");
        expect(children).toBeInTheDocument();
    });

    test("Clicking the button triggers callback", () => {
        render(
            <FolderControlButton id={mockId} disabled={false} onClick={mockFn}>
                {mockChildren}
            </FolderControlButton>
        )
    
        const button = screen.getByRole("button");
    
        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalled();
    });

    test("Clicking triggers nothing when disabled", () => {
        render(
            <FolderControlButton id={mockId} disabled={true} onClick={mockFn}>
                {mockChildren}
            </FolderControlButton>
        )

        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(mockFn).not.toHaveBeenCalled();
    })
    
});