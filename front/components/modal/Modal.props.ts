export interface ModalProps {
  children:
    | React.ReactNode
    | React.ReactNode[]
    | React.ReactElement
    | React.ReactElement[];
  className?: string;
  onClose: () => void;
  open: boolean;
  title?: string;
  width?: string;
  position?: "top" | "right" | "bottom" | "left" | "center";
  hideCloseButton?: boolean;
}
