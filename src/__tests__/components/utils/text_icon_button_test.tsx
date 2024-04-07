import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import PopupMessage from "../../../components/utils/popup_message";
import PurpleBorderButton from "../../../components/utils/purple_border_button";
import SimpleSearchBar from "../../../components/utils/simple_search_bar";
import TextIconButton from "../../../components/utils/text_icon_button";

const mockFn = jest.fn();
const mockText = randomNumber().toString();
const mockId = randomNumber().toString();
const mockChild = <span data-testid="mock-span"></span>

describe("Test <TextIconButton>", () => {
    test("Renders non disabled button and triggers callback when clicked", () => {
        render(
            <TextIconButton id={mockId} text={mockText} disabled={false} textSize={"h-2"} onClick={mockFn}>
                {mockChild}
            </TextIconButton>
        )

        const button = screen.getByRole("button");
        expect(button).toHaveTextContent(mockText);
        expect(button).toBeVisible();
        
        const child = within(button).getByTestId("mock-span");
        expect(child).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalled();
    });

    test("button callback does not trigger when disabled", () => {
        render(
            <TextIconButton id={mockId} text={mockText} disabled={true} textSize={"h-2"} onClick={mockFn}>
                {mockChild}
            </TextIconButton>
        )

        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(mockFn).not.toHaveBeenCalled();
    })
});