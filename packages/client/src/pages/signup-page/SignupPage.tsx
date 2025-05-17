/* eslint-disable import/no-extraneous-dependencies */
import { Helmet } from 'react-helmet';
import React, { useCallback, FormEvent, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader, ContentContainer, FormField, MainForm } from '../../components';
import ROUTES from '../../constants/constants';
import useWithPasswordForm from '../../components/utils/hooks/form/useWithPasswordForm';
import { signupFormText, signupInputs, getFormData } from '../../components/utils/form-helper';
import { useAppDispatch } from '../../store/hooks';
import { fetchSignUp, fetchUserData } from '../../store/slices/userExtraReducers';
import { IReqData } from '../../utils/Api/AuthApi';
import { PageInitArgs } from '../../routes-object';
import { selectUser } from '../../store/slices/userSlice';
import usePage from '../../hooks/usePage';

export const initSignupPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    await dispatch(fetchUserData());
  }
};

const HelmetComponent = Helmet as unknown as React.FC<{
  children: React.ReactNode;
}>;

function SignupPage() {
  usePage({ initPage: initSignupPage });

  const formType = 'signup';
  const ids = signupInputs.map(({ id }) => id);
  const {
    formData, isFormValid, handleChange, handleBlur,
  } = useWithPasswordForm(getFormData(ids), formType);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleNavigate = useCallback(() => {
    navigate(ROUTES.LOGIN);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const reqData: IReqData = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, { value }] of Object.entries(formData)) {
      reqData[key] = value;
    }

    try {
      const data = await dispatch(fetchSignUp(reqData));
      if (data) navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Login error:', error);
    }
  }, [formData]);

  const { formTitle, submitText, linkText } = signupFormText;
  return (
    <>
      <HelmetComponent>
        <meta charSet="utf-8" />
        <title>Регистрация</title>
        <meta name="description" content="Страница регистрации" />
      </HelmetComponent>
      <AppHeader />
      <ContentContainer>
        <MainForm
          type={formType}
          formTitle={formTitle}
          submitText={submitText}
          linkText={linkText}
          isFormValid={isFormValid}
          onSubmit={handleSubmit}
          onNavigate={handleNavigate}
        >

          {signupInputs.map(({ id, type, placeholder, text }) => (
            <FormField
              key={id}
              id={id}
              type={type}
              placeholder={placeholder}
              text={text}
              errorMessage={formData[id].errorText}
              value={formData[id].value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}
        </MainForm>
      </ContentContainer>
    </>
  );
}

export default memo(SignupPage);
