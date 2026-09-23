import { cn } from "@/lib/utils";
import styles from "./Text.module.scss";
import type { TextProps } from "./Text.props";

interface TextVariants {
  title: "h1";
  subtitle: "h2";
  heading: "h3";
  helper: "span";
  text: "p";
  error: "span";
  label: "label";
  span: "span";
}

const variants: TextVariants = {
  title: "h1",
  subtitle: "h2",
  heading: "h3",
  // `helper`/`error` are inline text inside containers (not tables): they must
  // be <span>. They used to be <caption>, only valid inside <table>, which
  // caused a hydration error when shown inside a <div>.
  helper: "span",
  text: "p",
  error: "span",
  label: "label",
  span: "span"
};

export function Text(props: Readonly<TextProps>) {
  const { as = "text", className, content, children } = props;

  const Parent = (as ? variants[as as keyof typeof variants] : "p") as
    | "h1"
    | "h2"
    | "p"
    | "label"
    | "caption"
    | "span";

  const classNames = cn(styles.text, props.as && styles[props.as], className);

  return <Parent className={classNames}>{content || children}</Parent>;
}
