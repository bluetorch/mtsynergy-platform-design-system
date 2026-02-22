import React from 'react';
import { Dialog, Transition } from '@headlessui/react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'mts-max-w-sm',
  md: 'mts-max-w-md',
  lg: 'mts-max-w-lg',
  xl: 'mts-max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnEscape = true,
  closeOnClickOutside = true,
}) => {
  const handleEscape = (event: React.KeyboardEvent) => {
    if (closeOnEscape && event.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = () => {
    if (closeOnClickOutside) {
      onClose();
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="mts-relative mts-z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="mts-ease-out mts-duration-200"
          enterFrom="mts-opacity-0"
          enterTo="mts-opacity-100"
          leave="mts-ease-in mts-duration-150"
          leaveFrom="mts-opacity-100"
          leaveTo="mts-opacity-0"
        >
          <div
            className="mts-fixed mts-inset-0 mts-bg-black mts-bg-opacity-50"
            onClick={handleBackdropClick}
          />
        </Transition.Child>

        <div className="mts-fixed mts-inset-0 mts-overflow-y-auto">
          <div className="mts-flex mts-items-center mts-justify-center mts-min-h-full mts-p-4">
            <Transition.Child
              as={React.Fragment}
              enter="mts-ease-out mts-duration-200"
              enterFrom="mts-opacity-0 mts-scale-95"
              enterTo="mts-opacity-100 mts-scale-100"
              leave="mts-ease-in mts-duration-150"
              leaveFrom="mts-opacity-100 mts-scale-100"
              leaveTo="mts-opacity-0 mts-scale-95"
            >
              <Dialog.Panel
                className={`${sizeStyles[size]} mts-w-full mts-rounded-lg mts-bg-white mts-shadow-lg mts-divide-y mts-divide-secondary-200`}
                onKeyDown={handleEscape}
              >
                {title && (
                  <div className="mts-flex mts-items-center mts-justify-between mts-p-6">
                    <Dialog.Title className="mts-text-lg mts-font-semibold mts-text-primary-900">
                      {title}
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      aria-label="Close dialog"
                      className="mts-text-secondary-400 hover:mts-text-secondary-600 mts-transition-colors"
                    >
                      <svg className="mts-w-6 mts-h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="mts-p-6">{children}</div>

                {footer && <div className="mts-px-6 mts-py-4 mts-bg-secondary-50">{footer}</div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
