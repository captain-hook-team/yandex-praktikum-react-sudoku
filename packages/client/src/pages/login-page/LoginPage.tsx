import { useCallback, FormEvent, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ContentContainer, FormField, MainForm,
} from '../../components/index';
import ROUTES from '../../constants/constants';
import useForm from '../../components/utils/hooks/form/useForm';
import { loginFormText, loginInputs, getFormData } from '../../components/utils/form-helper';
import { useAppDispatch } from '../../store/hooks';
import { fetchAuthorize, fetchServiceId } from '../../store/slices/userExtraReducers';
import { IReqData } from '../../utils/Api/AuthApi';
import { showNotification } from '../../utils/notificationApi';

function LoginPage() {
  const formType = 'login';
  const ids = loginInputs.map(({ id }) => id);
  const { formData, isFormValid, handleChange, handleBlur } = useForm(getFormData(ids), formType);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleNavigate = useCallback(() => {
    navigate(ROUTES.SIGN_UP);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const reqData: IReqData = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, { value }] of Object.entries(formData)) {
      reqData[key] = value;
    }

    try {
      const data = await dispatch(fetchAuthorize(reqData)).unwrap();
      if (data) {
        navigate(ROUTES.MAIN);
        showNotification('Выполнен вход в систему');
      }
    } catch (error) {
      console.error('LoginPage error:', error);
    }
  }, [formData, dispatch]);

  const handleOtherAuthorize = useCallback(async () => {
    try {
      await dispatch(fetchServiceId()).unwrap();
    } catch (error) {
      console.error('Ошибка авторизации через Яндекс', error);
    }
  }, [formData, dispatch]);

  const { formTitle, submitText, otherAuthText, linkText } = loginFormText;
  return (
    <ContentContainer>
      <MainForm
        type={formType}
        formTitle={formTitle}
        submitText={submitText}
        otherAuthText={otherAuthText}
        linkText={linkText}
        isFormValid={isFormValid}
        onSubmit={handleSubmit}
        onOtherAuthorize={handleOtherAuthorize}
        onNavigate={handleNavigate}
      >

        {loginInputs.map(({ id, type, placeholder, text }) => (
          <FormField
            key={id}
            id={id}
            placeholder={placeholder}
            type={type}
            text={text}
            errorMessage={formData[id].errorText}
            value={formData[id].value}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ))}
      </MainForm>
    </ContentContainer>
  );
}

export default memo(LoginPage);
