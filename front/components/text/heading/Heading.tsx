import { Text } from "../text-variant/text";
import styles from "./Heading.module.scss";

export function Heading({ content }: Readonly<{ content: string }>) {
  return <Text className={styles.class} content={content} />;
}
