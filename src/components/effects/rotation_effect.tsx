import iRotationEffect from "../../interfaces/rotation_effect";

// Rotate an encapsulated component
const RotationEffect = (props: iRotationEffect): JSX.Element => {
	const { children, rotated, display } = props;

	return (
		<div
			className={`${rotated ? "rotate-180" : "rotate-0"} ${display || "block"} transition ease-in-out duration-75`}
		>
			{children}
		</div>
	);
};

export default RotationEffect;
