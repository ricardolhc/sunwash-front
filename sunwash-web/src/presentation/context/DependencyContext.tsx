import React, { createContext, useMemo } from 'react';
import type { AppointmentGateway } from '../../application/gateway/AppointmentGateway';
import type { PaymentGateway } from '../../application/gateway/PaymentGateway';
import { CreateAppointmentUseCase } from '../../application/usecase/CreateAppointmentUseCase';
import { GetAppointmentByIdUseCase } from '../../application/usecase/GetAppointmentByIdUseCase';
import { ListUserAppointmentsUseCase } from '../../application/usecase/ListUserAppointmentsUseCase';
import { ListAllAppointmentsUseCase } from '../../application/usecase/ListAllAppointmentsUseCase';
import { UpdateAppointmentStatusUseCase } from '../../application/usecase/UpdateAppointmentStatusUseCase';
import { UploadDronePhotosUseCase } from '../../application/usecase/UploadDronePhotosUseCase';
import { GeneratePixPaymentUseCase } from '../../application/usecase/GeneratePixPaymentUseCase';
import { AuthorizeCreditCardUseCase } from '../../application/usecase/AuthorizeCreditCardUseCase';
import { FinalizeServiceAndCaptureUseCase } from '../../application/usecase/FinalizeServiceAndCaptureUseCase';
import { MemoryAppointmentGateway } from '../../infra/gateway/MemoryAppointmentGateway';
import { HttpAppointmentGateway } from '../../infra/gateway/HttpAppointmentGateway';
import { MemoryPaymentGateway } from '../../infra/gateway/MemoryPaymentGateway';
import { HttpPaymentGateway } from '../../infra/gateway/HttpPaymentGateway';
import type { AuthGateway } from '../../application/gateway/AuthGateway';
import { createAuthGateway } from '../../infra/gateway/createAuthGateway';

export interface DependencyContainer {
  authGateway: AuthGateway;
  appointmentGateway: AppointmentGateway;
  paymentGateway: PaymentGateway;
  createAppointmentUseCase: CreateAppointmentUseCase;
  getAppointmentByIdUseCase: GetAppointmentByIdUseCase;
  listUserAppointmentsUseCase: ListUserAppointmentsUseCase;
  listAllAppointmentsUseCase: ListAllAppointmentsUseCase;
  updateAppointmentStatusUseCase: UpdateAppointmentStatusUseCase;
  uploadDronePhotosUseCase: UploadDronePhotosUseCase;
  generatePixPaymentUseCase: GeneratePixPaymentUseCase;
  authorizeCreditCardUseCase: AuthorizeCreditCardUseCase;
  finalizeServiceAndCaptureUseCase: FinalizeServiceAndCaptureUseCase;
}

export const DependencyContext = createContext<DependencyContainer | null>(null);

export interface DependencyProviderProps {
  children: React.ReactNode;
  overrideDependencies?: Partial<DependencyContainer>;
}

export const DependencyProvider: React.FC<DependencyProviderProps> = ({
  children,
  overrideDependencies,
}) => {
  const dependencies = useMemo<DependencyContainer>(() => {
    const useHttp = typeof __VITE_USE_HTTP__ === 'boolean' ? __VITE_USE_HTTP__ : true;
    const useHttpAuth = typeof __VITE_USE_HTTP_AUTH__ === 'boolean' ? __VITE_USE_HTTP_AUTH__ : false;

    const authGateway = createAuthGateway(useHttpAuth, overrideDependencies?.authGateway);

    const appointmentGateway: AppointmentGateway =
      overrideDependencies?.appointmentGateway ??
      (useHttp ? new HttpAppointmentGateway() : new MemoryAppointmentGateway());

    const paymentGateway: PaymentGateway =
      overrideDependencies?.paymentGateway ??
      (useHttp ? new HttpPaymentGateway() : new MemoryPaymentGateway());

    const createAppointmentUseCase =
      overrideDependencies?.createAppointmentUseCase ??
      new CreateAppointmentUseCase(appointmentGateway);

    const getAppointmentByIdUseCase =
      overrideDependencies?.getAppointmentByIdUseCase ??
      new GetAppointmentByIdUseCase(appointmentGateway);

    const listUserAppointmentsUseCase =
      overrideDependencies?.listUserAppointmentsUseCase ??
      new ListUserAppointmentsUseCase(appointmentGateway);

    const listAllAppointmentsUseCase =
      overrideDependencies?.listAllAppointmentsUseCase ??
      new ListAllAppointmentsUseCase(appointmentGateway);

    const updateAppointmentStatusUseCase =
      overrideDependencies?.updateAppointmentStatusUseCase ??
      new UpdateAppointmentStatusUseCase(appointmentGateway);

    const uploadDronePhotosUseCase =
      overrideDependencies?.uploadDronePhotosUseCase ??
      new UploadDronePhotosUseCase(appointmentGateway);

    const generatePixPaymentUseCase =
      overrideDependencies?.generatePixPaymentUseCase ??
      new GeneratePixPaymentUseCase(paymentGateway);

    const authorizeCreditCardUseCase =
      overrideDependencies?.authorizeCreditCardUseCase ??
      new AuthorizeCreditCardUseCase(paymentGateway);

    const finalizeServiceAndCaptureUseCase =
      overrideDependencies?.finalizeServiceAndCaptureUseCase ??
      new FinalizeServiceAndCaptureUseCase(appointmentGateway, paymentGateway);

    return {
      authGateway,
      appointmentGateway,
      paymentGateway,
      createAppointmentUseCase,
      getAppointmentByIdUseCase,
      listUserAppointmentsUseCase,
      listAllAppointmentsUseCase,
      updateAppointmentStatusUseCase,
      uploadDronePhotosUseCase,
      generatePixPaymentUseCase,
      authorizeCreditCardUseCase,
      finalizeServiceAndCaptureUseCase,
    };
  }, [overrideDependencies]);

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  );
};
