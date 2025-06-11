// src/hooks/usePermissionAlert.ts
import React, { useState, useEffect } from 'react';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAuth } from '../context';
import { theme } from '../config/theme';
import CustomAlert from '../components/commons/CustomAlert';

interface UsePermissionAlertOptions {
  requiredRoles?: ('maestro' | 'normal' | 'supervisor')[]; 
  redirectScreen?: string; 
  alertTitle?: string;
  alertMessage?: string;
  alertIconName?: string;
  alertIconColor?: string;
  alertButtonText?: string;
}

const usePermissionAlert = (options?: UsePermissionAlertOptions) => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [showAlert, setShowAlert] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const {
    requiredRoles = ['maestro'],
    redirectScreen = 'Contacts', 
    alertTitle = 'Acceso Restringido',
    alertMessage = 'Esta sección es exclusiva para usuarios con un rol específico. Si crees que deberías tener acceso, por favor, contacta al soporte técnico.',
    alertIconName = 'lock-closed-outline',
    alertIconColor = theme.primaryDarkBlue,
    alertButtonText = 'Entendido',
  } = options || {};

  useEffect(() => {
    const userHasPermission = requiredRoles.includes(user?.role as 'maestro' | 'normal' | 'supervisor');
    setHasPermission(userHasPermission);

    if (!userHasPermission) {
      setShowAlert(true);
    }
    
  }, [user?.role, requiredRoles]);

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (redirectScreen) {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: redirectScreen }],
            })
        );
    } else if (navigation.canGoBack()) {
        navigation.goBack();
    } else {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Contacts' }], 
            })
        );
    }
  };

  const renderPermissionAlert = () => {
    if (!showAlert) return null;

    return (
      <CustomAlert
        visible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onClose={handleCloseAlert}
        iconName={alertIconName}
        iconColor={alertIconColor}
        buttonText={alertButtonText}
      />
    );
  };

  return {
    hasPermission,
    renderPermissionAlert,
    showAlert,
  };
};

export default usePermissionAlert;