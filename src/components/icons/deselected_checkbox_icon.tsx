import { iSVG } from "../../interfaces/svg";

function DeselectedCheckboxIcon(props: iSVG): JSX.Element {
	const { size, fill } = props;

	return (
		<svg
			data-testid={"deselected-checkbox-icon"}
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			height={size}
			viewBox="0 -960 960 960"
			width={size}
		>
			<path
				fill={fill}
				d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z"
			/>
		</svg>
	);
}

export default DeselectedCheckboxIcon;
