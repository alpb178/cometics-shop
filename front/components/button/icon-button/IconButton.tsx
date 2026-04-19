'use client';

import { Loader } from '@/components/loader/Loader';
import clsx from 'clsx';
import styles from './IconButton.module.scss';
import { IconButtonProps } from './IconButton.props';

export function IconButton(props: Readonly<IconButtonProps>) {
  const classNames = clsx(
    styles.IconButton,
    props.className ? props.className : '',
    props.size ? styles[props.size] : ''
  );

  return (
    <button
      type={props.type ?? 'button'}
      className={classNames}
      aria-label="Button"
      disabled={props.disabled ?? props.isLoading}
      onClick={props.onClick}
    >
      {props.isLoading && (
        <div>
          <Loader size={64} />
        </div>
      )}

      {props.icon}
    </button>
  );
}
