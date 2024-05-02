import { render, screen, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import randomNumber from "../../../tools/random_number";
import GenericPopup from "../../../components/utils/generic_popup";

const mockTitle = randomNumber().toString();
const mockChild = <div data-testid="mock-child"></div>;

const mockSave = {
	label: randomNumber().toString(),
	handler: jest.fn()
};
const mockCancel = {
	label: randomNumber().toString(),
	handler: jest.fn()
};

afterEach(() => {
	jest.clearAllMocks();
});

describe("Test <GenericPopup>", () => {
	const typeCases: Array<"slide-in" | "popup"> = ["slide-in", "popup"];

	describe("When 'save' prop is missing", () => {
		const props = {
			title: mockTitle,
			show: true,
			cancel: mockCancel
		};

		test.each(typeCases)("Popup renders", (type) => {
			render(
				<GenericPopup type={type} {...props}>
					{mockChild}
				</GenericPopup>
			);

			const popup = screen.getByRole("dialog");
			expect(popup).toBeInTheDocument();
		});

		test.each(typeCases)("Displays 'title' prop in heading", (type) => {
			render(
				<GenericPopup type={type} {...props}>
					{mockChild}
				</GenericPopup>
			);

			const popup = screen.getByRole("dialog");
			const heading = within(popup).queryByRole("heading");
			expect(heading).toHaveTextContent(mockTitle);
		});

		test.each(typeCases)(
			"X button exists and triggers 'cancel' callback when clicked",
			(type) => {
				render(
					<GenericPopup type={type} {...props}>
						{mockChild}
					</GenericPopup>
				);

				const popup = screen.getByRole("dialog");
				const xButton = within(popup).getByRole("img");

				fireEvent.click(xButton);
				expect(mockCancel.handler).toHaveBeenCalled();
			}
		);

		test.each(typeCases)("Close button is not visible due to missing 'save' prop", (type) => {
			render(
				<GenericPopup type={type} {...props}>
					{mockChild}
				</GenericPopup>
			);

			const closeButton = screen.queryByText(mockCancel.label, {
				selector: "button"
			});

			expect(closeButton).not.toBeInTheDocument();
		});

		test.each(typeCases)("Save button is not visible due to missing 'save' prop", (type) => {
			render(
				<GenericPopup type={type} {...props}>
					{mockChild}
				</GenericPopup>
			);

			const saveButton = screen.queryByText(mockSave.label, {
				selector: "button"
			});
			expect(saveButton).not.toBeInTheDocument();
		});
	});

	describe("When 'save' prop is provided", () => {
		const props = {
			title: mockTitle,
			show: true,
			cancel: mockCancel,
			save: mockSave
		};

		test.each(typeCases)("Popup renders", (type) => {
			render(
				<GenericPopup {...props} type={type}>
					{mockChild}
				</GenericPopup>
			);

			const popup = screen.getByRole("dialog");
			expect(popup).toBeInTheDocument();
		});

		test.each(typeCases)("Displays 'title' prop in heading", (type) => {
			render(
				<GenericPopup {...props} type={type}>
					{mockChild}
				</GenericPopup>
			);

			const popup = screen.getByRole("dialog");
			const heading = within(popup).queryByRole("heading");
			expect(heading).toHaveTextContent(mockTitle);
		});

		test.each(typeCases)(
			"X button exists and triggers 'cancel' callback when clicked",
			(type) => {
				render(
					<GenericPopup {...props} type={type}>
						{mockChild}
					</GenericPopup>
				);

				const popup = screen.getByRole("dialog");
				const xButton = within(popup).getByRole("img");

				fireEvent.click(xButton);
				expect(mockCancel.handler).toHaveBeenCalled();
			}
		);

		test.each(typeCases)("Close button is visible", (type) => {
			render(
				<GenericPopup {...props} type={type}>
					{mockChild}
				</GenericPopup>
			);

			const closeButton = screen.queryByText(mockCancel.label, {
				selector: "button"
			});

			expect(closeButton).toBeInTheDocument();
		});

		test.each(typeCases)("Close button triggers 'cancel' callback when clicked", (type) => {
			render(
				<GenericPopup {...props} type={type}>
					{mockChild}
				</GenericPopup>
			);

			const closeButton = screen.getByText(mockCancel.label, {
				selector: "button"
			});
			fireEvent.click(closeButton);
			expect(mockCancel.handler).toHaveBeenCalled();
		});

		test.each(typeCases)("Save button is visible", (type) => {
			render(
				<GenericPopup {...props} type={type}>
					{mockChild}
				</GenericPopup>
			);

			const saveButton = screen.queryByText(mockSave.label, {
				selector: "button"
			});
			expect(saveButton).toBeInTheDocument();
		});

		test.each(typeCases)("Save button triggers 'save' callback when clicked", (type) => {
			render(
				<GenericPopup {...props} type={type}>
					{mockChild}
				</GenericPopup>
			);

			const saveButton = screen.getByText(mockSave.label, {
				selector: "button"
			});
			fireEvent.click(saveButton);
			expect(mockSave.handler).toHaveBeenCalled();
		});
	});
});
