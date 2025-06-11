import React, { useState, useCallback } from 'react';
import CustomAlertModal from '../components/commons/CustomAlertModal';
import { theme } from '../config/theme';

interface ModalOptions {
  title: string;
  message: string;
  iconName: string;
  iconColor: string;
  buttonText?: string;
  showButton?: boolean;
  onCloseCallback?: () => void; 
}

interface UseFeedbackModalReturn {
  showModal: (options: ModalOptions) => void;
  FeedbackModalComponent: React.FC;
}

const useFeedbackModal = (): UseFeedbackModalReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ModalOptions>({
    title: '',
    message: '',
    iconName: '',
    iconColor: theme.primaryDarkBlue, 
    onCloseCallback: undefined, 
  });

  const showModal = useCallback((options: ModalOptions) => {
    setModalContent(options);
    setIsVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);
    if (modalContent.onCloseCallback) {
      modalContent.onCloseCallback();
    }
    setModalContent({
      title: '',
      message: '',
      iconName: '',
      iconColor: theme.primaryDarkBlue,
      onCloseCallback: undefined,
    });
  }, [modalContent.onCloseCallback]);

  const FeedbackModalComponent: React.FC = () => (
    <CustomAlertModal
      isVisible={isVisible}
      onClose={hideModal}
      title={modalContent.title}
      message={modalContent.message}
      iconName={modalContent.iconName}
      iconColor={modalContent.iconColor}
      buttonText={modalContent.buttonText}
      showButton={modalContent.showButton}
    />
  );

  return { showModal, FeedbackModalComponent };
};

export default useFeedbackModal;