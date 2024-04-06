import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import CircleButton from '../../../components/utils/circle_button';
import randomNumber from "../../../tools/random_number";
import FormField from "../../../components/utils/form_field";
import Group from "../../../components/utils/group";
import Paragraph from "../../../components/utils/paragraph";

const mockText = randomNumber().toString();

describe("Test <Paragraph>", () => {
    test("Renders ok", () => {
        render(
            <Paragraph>
                {mockText}
            </Paragraph>
        )

       const text = screen.getByText(mockText);
       expect(text).toBeVisible();
    })
});