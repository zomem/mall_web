import css from "@/components/panda/css";
import { useContext } from "react";
import { ThemeContext } from "@/common/context";

interface TitleProps {
  title: string;
}
const Title = ({ title = "" }: TitleProps) => {
  const { themeCtx } = useContext(ThemeContext);
  return (
    <div
      className={css({
        boxSizing: "border-box",
        padding: "0 0 0 10px",
        fontSize: "xl",
        fontWeight: "bold",
        color: themeCtx === "dark" ? "rgba(255, 255, 255, 0.85)" : "#000",
      })}
    >
      {title}
    </div>
  );
};

export default Title;
