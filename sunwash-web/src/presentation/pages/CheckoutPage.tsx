import React from 'react';
import { useCheckoutController } from '../controller/useCheckoutController';
import { CheckoutView } from '../view/Checkout/CheckoutView';

export const CheckoutPage: React.FC = () => {
  const controller = useCheckoutController();

  return (
    <CheckoutView
      appointment={controller.appointment}
      isLoadingAppointment={controller.isLoadingAppointment}
      paymentMethod={controller.paymentMethod}
      setPaymentMethod={controller.setPaymentMethod}
      pixPayment={controller.pixPayment}
      isLoadingPix={controller.isLoadingPix}
      copiedPix={controller.copiedPix}
      handleCopyPix={controller.handleCopyPix}
      handleConfirmPixPayment={controller.handleConfirmPixPayment}
      cardData={controller.cardData}
      cardElementContainerRef={controller.cardElementContainerRef}
      setCardData={controller.setCardData}
      handleCardSubmit={controller.handleCardSubmit}
      isProcessingCard={controller.isProcessingCard}
      errorMessage={controller.errorMessage}
      successMessage={controller.successMessage}
      clearError={controller.clearError}
    />
  );
};
