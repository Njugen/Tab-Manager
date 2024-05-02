import { iSVG } from "../../interfaces/svg";

function FullscreenIcon(props: iSVG): JSX.Element {
	const { size, fill } = props;

	return (
		<svg
			data-testid={"fullscreen-icon"}
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			height={size}
			viewBox="0 -960 960 960"
			width={size}
		>
			<path
				fill={fill}
				d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z"
			/>
		</svg>
	);
}

export default FullscreenIcon;
