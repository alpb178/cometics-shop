/**
 * Properties definition for the Button component
 */
export interface IconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  color?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'info'
    | string;
  icon?: React.ReactElement;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  variant?: 'flat' | 'outline' | 'solid';
}
