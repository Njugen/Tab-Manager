import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import FolderControlButton from "../../../components/utils/icon_button/icon_button";

const mockFunction = jest.fn();
describe("test <FolderControlButton />", () => {

    test("Button renders ok and trigger a function when clicked", () => {
        const num: number = randomNumber();

        render(
            <FolderControlButton id="my-button" active={true} onClick={mockFunction}>
                <p>{num.toString()}</p>
            </FolderControlButton>
        );
        const button = screen.getByRole("button");
        expect(button).toHaveTextContent(num.toString());
        
        fireEvent.click(button);
        expect(mockFunction).toHaveBeenCalled();
    });

    test("Disabled button renders ok and does not trigger anything at click", () => {
        const num: number = randomNumber();

        render(
            <FolderControlButton id="my-button" active={false} onClick={mockFunction}>
                <p>{num.toString()}</p>
            </FolderControlButton>
        );
        const button = screen.getByRole("button");
        expect(button).toHaveTextContent(num.toString());
        
        fireEvent.click(button);
        expect(mockFunction).not.toHaveBeenCalled();
    });

}); 