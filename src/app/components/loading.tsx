import { RotatingLines } from "react-loader-spinner";

interface Props {
  size: "sm" | "md" | "lg";
  variant: "light" | "dark";
}

export default function Loading(props: Props) {
  let strokeWidth = "3";
  let width = "20";

  if (props.size == "lg") {
    width = "45";
  } else if (props.size == "md") {
    width = "30";
  }

  return (
    <center>
      <RotatingLines
        strokeColor={props.variant == "light" ? "white" : "black"}
        strokeWidth={strokeWidth}
        animationDuration="0.1"
        width={width}
        visible={true}
      />
    </center>
  );
}
