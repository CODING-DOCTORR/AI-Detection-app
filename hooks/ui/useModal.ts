// hooks/ui/useModal.ts
import { useState, useCallback } from 'react';
import { ModalType, ModalButton } from '../../components/AppModal';

interface ModalState {
    visible: boolean;
    type?: ModalType;
    title?: string;
    message?: string;
    buttons?: ModalButton[];
    loading?: boolean;
    showCloseIcon?: boolean;
}

export const useModal = () => {
    const [modal, setModal] = useState<ModalState>({ visible: false });

    const showModal = useCallback((config: Omit<ModalState, 'visible'>) => {
        setModal({ ...config, visible: true });
    }, []);

    const hideModal = useCallback(() => {
        setModal((prev) => ({ ...prev, visible: false }));
    }, []);

    // Success modal
    const showSuccess = useCallback(
        (title: string, message?: string, onOk?: () => void) => {
            showModal({
                type: 'success',
                title,
                message,
                buttons: [
                    {
                        text: 'OK',
                        style: 'primary',
                        onPress: () => {
                            hideModal();
                            onOk?.();
                        },
                    },
                ],
            });
        },
        [showModal, hideModal]
    );

    // Error modal
    const showError = useCallback(
        (title: string, message?: string, onOk?: () => void) => {
            showModal({
                type: 'error',
                title,
                message,
                buttons: [
                    {
                        text: 'OK',
                        style: 'primary',
                        onPress: () => {
                            hideModal();
                            onOk?.();
                        },
                    },
                ],
            });
        },
        [showModal, hideModal]
    );

    // Warning modal
    const showWarning = useCallback(
        (title: string, message?: string, onOk?: () => void) => {
            showModal({
                type: 'warning',
                title,
                message,
                buttons: [
                    {
                        text: 'OK',
                        style: 'primary',
                        onPress: () => {
                            hideModal();
                            onOk?.();
                        },
                    },
                ],
            });
        },
        [showModal, hideModal]
    );

    // 🆕 Info modal
    const showInfo = useCallback(
        (title: string, message?: string, onOk?: () => void) => {
            showModal({
                type: 'info',
                title,
                message,
                buttons: [
                    {
                        text: 'OK',
                        style: 'primary',
                        onPress: () => {
                            hideModal();
                            onOk?.();
                        },
                    },
                ],
            });
        },
        [showModal, hideModal]
    );

    // 🆕 Confirmation modal with custom button text
    const showConfirm = useCallback(
        (
            title: string,
            message: string,
            onConfirm: () => void,
            onCancel?: () => void,
            confirmText: string = 'Confirm',
            cancelText: string = 'Cancel'
        ) => {
            showModal({
                type: 'confirm',
                title,
                message,
                buttons: [
                    {
                        text: cancelText,
                        style: 'secondary',
                        onPress: () => {
                            hideModal();
                            onCancel?.();
                        },
                    },
                    {
                        text: confirmText,
                        style: 'danger',
                        onPress: () => {
                            hideModal();
                            onConfirm();
                        },
                    },
                ],
            });
        },
        [showModal, hideModal]
    );

    // Loading modal
    const showLoading = useCallback(
        (title?: string, message?: string) => {
            showModal({
                type: 'loading',
                title: title || 'Loading',
                message,
                loading: true,
                showCloseIcon: false,
            });
        },
        [showModal]
    );

    return {
        modal,
        showModal,
        hideModal,
        showSuccess,
        showError,
        showWarning,
        showInfo,       // 🆕 Added
        showConfirm,
        showLoading,
    };
};