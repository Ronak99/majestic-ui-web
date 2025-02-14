import Image from "next/image";

interface Props {
  size: "sm" | "md" | "lg";
  variant: "light" | "dark";
}

export default function Loading(props: Props) {
  const strokeWidth = "3";
  let width = 20;

  if (props.size == "lg") {
    width = 45;
  } else if (props.size == "md") {
    width = 30;
  }

  return (
    <center>
      <Image
        src={
          props.variant == "dark" ? "/loading-dark.svg" : "/loading-light.svg"
        }
        alt="loading"
        width={width}
        height={width}
      />
    </center>
  );
}
