import { iSVG } from "../../interfaces/svg";

function CloseIcon(props: iSVG): JSX.Element {
	const { size, fill } = props;

	return (
		<svg
			data-testid={"close-icon"}
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			height={size}
			viewBox="0 -960 960 960"
			width={size}
		>
			<path
				fill={fill}
				d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"
			/>
		</svg>
	);
}

export default CloseIcon;
