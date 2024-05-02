import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import Switcher from "../../../components/utils/switcher/switcher";

const mockLabel = randomNumber().toString();
const mockFn = jest.fn((e: boolean | null) => e);

afterEach(() => {
    jest.clearAllMocks();
})

describe("Test <Switcher>", () => {
    test("Label is visible", () => {
        render(
            <Switcher label={mockLabel} value={false} onCallback={mockFn} />
        )
        
        const label = screen.getByText(mockLabel);
        expect(label).toBeInTheDocument();
    });

    test("Label is not visible without props", () => {
        render(
            <Switcher value={false} onCallback={mockFn} />
        )
        
        const label = screen.queryByText(mockLabel);
        expect(label).not.toBeInTheDocument();
    });

    test("Toggling on works", () => {
        render(
            <Switcher label={mockLabel} value={false} onCallback={mockFn} />
        )

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockFn).toHaveBeenCalledWith(true);
    });

    test("Toggline on->off works", () => {
        render(
            <Switcher label={mockLabel} value={false} onCallback={mockFn} />
        )
        
        const label = screen.getByText(mockLabel);
        expect(label).toBeInTheDocument();

        const button = screen.getByRole("button");
        fireEvent.click(button);
        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalledWith(false)
    });

    test("Toggline off", () => {
        render(
            <Switcher label={mockLabel} value={true} onCallback={mockFn} />
        )
        
        const label = screen.getByText(mockLabel);
        expect(label).toBeInTheDocument();

        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(mockFn).toHaveBeenCalledWith(false)
    });

});