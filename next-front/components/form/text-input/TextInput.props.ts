export interface TextInputProps {
  as?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  type?: string;
  variant?: 'filled' | 'outlined';
  hideReset?: boolean;
  validation?: Record<string, unknown>;
  actionComponent?: React.ReactNode;
  helperText?: string;
}
