export interface TextProps {
  as?: "title" | "subtitle" | "helper" | "error" | "label" | "heading" | "span";
  content?: string | number;
  className?: string;
  children?: React.ReactNode;
  numberOfLines?: number;
  style?: { [key: string]: string | number };
  // variant?:
  //   | "body"
  //   | "h1"
  //   | "h2"
  //   | "h3"
  //   | "h4"
  //   | "h5"
  //   | "h6"
  //   | "caption"
  //   | "button"
  //   | "error"
  //   | "label";
  onPress?: () => void;
  htmlFor?: string;
}
