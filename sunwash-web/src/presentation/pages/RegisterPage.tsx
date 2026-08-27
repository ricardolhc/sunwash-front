import { useRegisterController } from '../controller/useRegisterController';
import { RegisterView } from '../view/Auth/RegisterView';

export const RegisterPage = () => {
  const controller = useRegisterController();

  return (
    <RegisterView
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
