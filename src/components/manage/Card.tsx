import css, { Div } from "@/components/panda/css";
import { ReactNode, useContext } from "react";
import { ThemeContext } from "@/common/context";

type OverType = "scroll" | "hidden";

interface CardProps {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;

  children?: ReactNode;
  title?: string;

  overflowX?: OverType;
  overflowY?: OverType;
  maxConHeight?: string;
  bg?: string;
}
const Card = ({
  width = "100%",
  height = "",
  padding = "",
  margin = "10px 0 0 0",
  children,
  title = "",
  overflowX = "hidden",
  overflowY = "scroll",
  maxConHeight = "",
  bg = "",
}: CardProps) => {
  const { themeCtx } = useContext(ThemeContext);
  return (
    <Div
      w={width}
      m={margin}
      p={padding}
      borderRadius="8px"
      bg={
        bg == "null"
          ? "rgba(0, 0, 0, 0.)"
          : themeCtx == "dark"
            ? "rgb(20, 20, 20)"
            : "#fff"
      }
    >
      {title && (
        <div
          className={css({
            margin: "0 0 10px 0",
            fontWeight: "bold",
            color: themeCtx == "dark" ? "rgba(255, 255, 255, 0.85)" : "#000",
          })}
        >
          {title}
        </div>
      )}
      <Div
        h={height}
        overflowX={overflowX}
        overflowY={overflowY}
        style={{
          maxHeight: maxConHeight,
        }}
        className={css({
          width: "100%",
        })}
      >
        {children}
      </Div>
    </Div>
  );
};

export default Card;
