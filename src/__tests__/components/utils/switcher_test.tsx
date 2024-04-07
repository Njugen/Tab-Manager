import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import PrimaryButton from "../../../components/utils/primary_button/primary_button";
import Switcher from "../../../components/utils/switcher/switcher";

const mockLabel = randomNumber().toString();
const mockFn = jest.fn((e: boolean | null) => e);

describe("Test <Switcher>", () => {
    test("Renders and toggle callback between true and false when clicked", () => {
        render(
            <Switcher label={mockLabel} value={false} onCallback={mockFn} />
        )
        
        const label = screen.getByText(mockLabel);
        expect(label).toBeInTheDocument();

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockFn).toHaveBeenCalledWith(true);
        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalledWith(false)
        fireEvent.click(button);
    });

    test("Renders without label ok", () => {
        render(
            <Switcher value={false} onCallback={mockFn} />
        )
        
        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockFn).toHaveBeenCalledWith(true);
        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalledWith(false)
        fireEvent.click(button);
    });

});