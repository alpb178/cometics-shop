import { CloseButton } from "@/components/button/close-button/CloseButton";
import { Dialog, DialogPanel } from "@headlessui/react";
import clsx from "clsx";
import { Container } from "../container/container-page";
import { Text } from "../text/text-variant/text";
import styles from "./Modal.module.scss";
import { ModalProps } from "./Modal.props";

export function Modal(props: Readonly<ModalProps>) {
  const {
    children,
    className,
    open,
    onClose,
    position,
    title,
    hideCloseButton
  } = props;

  return (
    <Dialog open={open} as="div" className={styles.dialog} onClose={onClose}>
      <div className="z-50 fixed inset-0">
        <div className="flex justify-center items-center bg-black/20 backdrop-blur-2xl h-screen">
          <DialogPanel
            transition
            className={clsx(
              styles.panel,
              position ? styles[position] : styles.full,
              className
            )}
          >
            <div className={styles.header}>
              {position !== "bottom" ? (
                <Container className="pb-2">
                  <div className="flex items-center space-x-4">
                    {!hideCloseButton && <CloseButton onClick={onClose} />}
                    {title && <Text as="title" content={title} />}
                  </div>
                </Container>
              ) : (
                <>
                  <div className="flex justify-center mt-3 w-full">
                    <div className="bg-gray-300 rounded-full w-8 h-1.5" />
                  </div>

                  <Container className="pb-0">
                    {title && <Text as="title" content={title} />}
                  </Container>
                </>
              )}
            </div>

            <div className={styles.content}>
              <div className="mx-auto max-w-xl h-full">{children}</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
