import { useLoginController } from '../controller/useLoginController';
import { LoginView } from '../view/Auth/LoginView';

export const LoginPage = () => {
  const controller = useLoginController();

  return (
    <LoginView
      form={controller.form}
      onSubmit={controller.onSubmit}
      isSubmitting={controller.isSubmitting}
      passwordVisible={controller.passwordVisible}
      togglePasswordVisible={controller.togglePasswordVisible}
      rootError={controller.rootError}
      fieldErrors={controller.fieldErrors}
    />
  );
};
