import { iSVG } from "../../interfaces/svg";

function ExpandIcon(props: iSVG): JSX.Element {
    const {size, fill} = props;

    return (<svg role="img" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}><path fill={fill} d="M480-345 240-585l43-43 197 198 197-197 43 43-240 239Z"/></svg>);
}

export default ExpandIcon;