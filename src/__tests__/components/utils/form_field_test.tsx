import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import randomNumber from "../../../tools/random_number";
import FormField from "../../../components/utils/form_field";
import { iFormField } from "../../../interfaces/form_field";

const mockLabel = randomNumber().toString();
const mockDesc = randomNumber().toString();
const mockTestId = randomNumber().toString();
const mockChild = <p data-testid={mockTestId}></p>;

const props: iFormField = {
	label: mockLabel,
	description: mockDesc
};

describe("Test <FormField>", () => {
	test("Field has 'label' prop as heading", () => {
		render(<FormField {...props}>{mockChild}</FormField>);

		const label = screen.getByRole("heading");
		expect(label).toHaveTextContent(mockLabel);
	});

	test("Field displays 'description' prop", () => {
		render(<FormField {...props}>{mockChild}</FormField>);

		const desc = screen.getByText(mockDesc);
		expect(desc).toBeInTheDocument();
	});

	test("Field has child component", () => {
		render(<FormField {...props}>{mockChild}</FormField>);

		const child = screen.getByTestId(mockTestId);
		expect(child).toBeInTheDocument();
	});

	test("Field indicates error when 'error' prop is set", () => {
		render(
			<FormField {...props} error={true}>
				{mockChild}
			</FormField>
		);

		const label = screen.queryByTestId("error-true");
		expect(label).toBeInTheDocument();
	});

	test("Field does not indicate error when 'error' prop is not set", () => {
		render(
			<FormField label={mockLabel} description={mockDesc}>
				{mockChild}
			</FormField>
		);

		const label = screen.queryByTestId("error-true");
		expect(label).not.toBeInTheDocument();
	});
});
