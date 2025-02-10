import { RotatingLines } from "react-loader-spinner";

interface Props {
  size: "sm" | "md" | "lg";
  variant: "light" | "dark";
}

export default function Loading(props: Props) {
  let strokeWidth = "4";
  let width = "20";

  if (props.size == "lg") {
    strokeWidth = "8";
    width = "35";
  } else if (props.size == "md") {
    strokeWidth = "6";
    width = "30";
  }

  return (
    <RotatingLines
      strokeColor={props.variant == "light" ? "white" : "black"}
      strokeWidth="4"
      animationDuration="0.1"
      width="20"
      visible={true}
    />
  );
}
