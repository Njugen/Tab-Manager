import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import GenericIconButton from "../../../components/utils/generic_icon_button";
import randomNumber from "../../../tools/random_number";
import PenIcon from "../../../components/icons/pen_icon";

const mockFunction = jest.fn();
const mockColors = [
    "rgba(0,0,0,1)",
    "#fff",
    "#d2d2d2",
    "rgba(158, 254, 255, 0.5)"
]

describe("test <GenericIconButton />", () => {
    test("Button exists and can be clicked", () => {
        const mockSize = Math.floor(Math.random() * 31);
        const mockColorIndex = Math.floor(Math.random() * mockColors.length);         
        const mockIcon = randomNumber().toString();

        render(
            <GenericIconButton icon={mockIcon} onClick={mockFunction}>
                <PenIcon size={mockSize} fill={mockColors[mockColorIndex]} />
            </GenericIconButton>
        );

        const button = screen.getByTestId(`generic-icon-button-${mockIcon}`);
        expect(button).toBeInTheDocument();
        expect(button).not.toBeEmptyDOMElement();

        fireEvent.click(button);
        expect(mockFunction).toHaveBeenCalled();
    });
});