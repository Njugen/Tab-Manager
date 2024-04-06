import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import CircleButton from '../../../components/utils/circle_button';
import randomNumber from "../../../tools/random_number";
import FormField from "../../../components/utils/form_field";
import Group from "../../../components/utils/group";
import Navlink from "../../../components/utils/navlink";

 
const mockChild = <img src="/favicon.ico" alt="test" data-testid="mock-child" />
const mockUrl = "http://google.com";
const mockFn = jest.fn();
const mockLabel = randomNumber().toString();

describe("Test <Navlink>", () => {
    test("Text, child element and label visible. Href in place", () => {
        render(
            <Navlink url={mockUrl} label={mockLabel} onClick={mockFn}>
                {mockChild}
            </Navlink>
        )

        const link = screen.getByRole("link");
        const child = within(link).getByTestId("mock-child");
        
        expect(link).toHaveAttribute("href", mockUrl);
        expect(link).toHaveTextContent(mockLabel);
        expect(child).toBeVisible();

        fireEvent.click(link);
        expect(mockFn).toHaveBeenCalled();
    });

    test("Rendering with no label works", () => {
        render(
            <Navlink url={mockUrl} onClick={mockFn}>
                {mockChild}
            </Navlink>
        )

        const link = screen.getByRole("link");
        const child = within(link).getByTestId("mock-child");
        
        expect(link).toHaveAttribute("href", mockUrl);
        expect(child).toBeVisible();

        fireEvent.click(link);
        expect(mockFn).toHaveBeenCalled();
    })
});