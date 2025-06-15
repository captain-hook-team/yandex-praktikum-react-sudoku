import { Helmet } from 'react-helmet';
import React, { ChangeEvent, FormEvent, useCallback, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../constants/constants';
import useForm from '../../components/utils/hooks/form/useForm';
import useWithPasswordForm from '../../components/utils/hooks/form/useWithPasswordForm';
import style from './ProfilePage.module.scss';
import Popup from '../../components/popup/Popup';
import { AppHeader, CustomButton, FormField } from '../../components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchChangeAvatar, fetchUpdateProfile, fetchChangePassword, fetchLogout, fetchUserData, fetchUserByCode } from '../../store/slices/userExtraReducers';
import { selectUser } from '../../store/slices/userSlice';
import defaultAvatar from '../../assets/images/default-avatar.png';
import { changePasswordInputs, profileInputs, getFormData } from '../../components/utils/form-helper';
import { IReqData } from '../../utils/Api/AuthApi';
import { IProfile } from '../../models/Profile';
import { PageInitArgs } from '../../routes-object';
import usePage from '../../hooks/usePage';

export const initProfilePage = async ({ dispatch, state, ctx }: PageInitArgs) => {
  const queue: Array<Promise<unknown>> = [dispatch(fetchUserByCode({
    clientToken: ctx.clientToken,
  }))];
  if (!selectUser(state)) {
    queue.push(dispatch(fetchUserData()));
  }
  return Promise.all(queue);
};

const HelmetComponent = Helmet as unknown as React.FC<{
  children: React.ReactNode;
}>;

function ProfilePage() {
  usePage({ initPage: initProfilePage });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

  const user = useAppSelector((state) => selectUser(state));

  const profileIds = profileInputs.map(({ id }) => id);
  const {
    formData, isFormValid, handleChange, handleBlur,
  } = useForm(getFormData(profileIds, user as IProfile), 'profile');

  const passIds = changePasswordInputs.map(({ id }) => id);
  const {
    formData: passFormData,
    isFormValid: isPassFormValid,
    handleChange: handlePassChange,
    handleBlur: handlePassBlur,
  } = useWithPasswordForm(getFormData(passIds), 'password');

  const [isEditing, setEditingMode] = useState<boolean>(false);
  const [isPasswordMode, setPasswordMode] = useState<boolean>(false);

  const handleLogout = useCallback(async () => {
    try {
      const data = await dispatch(fetchLogout()).unwrap();
      if (data) navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('ProfilePage error:', error);
    }
  }, [dispatch]);

  const handleCancel = () => {
    if (isPasswordMode) {
      setPasswordMode(false);
    }

    setEditingMode(false);
  };

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const reqData: IReqData = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, { value }] of Object.entries(formData)) {
      reqData[key] = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    try {
      await dispatch(fetchUpdateProfile(reqData)).unwrap();
      handleCancel();
    } catch (error) {
      console.error('error', error);
    }
  }, [formData, dispatch]);

  const handlePasswordSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(fetchChangePassword({
        newPassword: passFormData.password.value,
        oldPassword: passFormData.oldPassword.value,
      })).unwrap();
      handleCancel();
    } catch (error) {
      console.error('error', error);
    }
  }, [passFormData, dispatch]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const avatarformData = new FormData();

    if (!file) return;

    avatarformData.append('avatar', file);

    try {
      await dispatch(fetchChangeAvatar(avatarformData));
      setPopupOpen(false);
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <>
      <HelmetComponent>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Страница профиля" />
      </HelmetComponent>
      <AppHeader />
      <section className={style.profilePage}>
        <div className={style.profilePage__card}>
          <div className={style.profilePage__avatarContainer}>
            {user?.avatar
              ? <img src={`https://ya-praktikum.tech/api/v2/resources${user.avatar}`} alt="Avatar" className={style.profilePage__avatar} />
              : <img src={defaultAvatar} alt="Avatar" className={style.profilePage__avatar} />}
          </div>

          <div className={style.profilePage__actions}>
            <CustomButton
              type="button"
              color="transparent"
              text="Изменить аватар"
              onClick={() => setPopupOpen(true)}
            />

            <CustomButton
              type="button"
              color="transparent"
              text={!isPasswordMode ? 'Изменить пароль' : 'Данные пользователя'}
              onClick={() => setPasswordMode(!isPasswordMode)}
            />

            {!(isEditing || isPasswordMode) && (
            <>
              <CustomButton
                type="button"
                color="transparent"
                text="Редактировать"
                onClick={() => setEditingMode(true)}
              />

              <CustomButton
                className={[style.button__cancel]}
                type="button"
                color="transparent"
                text="Выйти"
                onClick={handleLogout}
              />
            </>
            )}
          </div>
          <form className={style.profilePage__form}>
            <div className={style.profilePage__fields}>
              {isPasswordMode
                ? changePasswordInputs.map(({ id, type, placeholder, text }) => (
                  <FormField
                    key={id}
                    id={id}
                    placeholder={placeholder}
                    type={type}
                    text={text}
                    errorMessage={passFormData[id].errorText}
                    value={passFormData[id].value}
                    onChange={handlePassChange}
                    onBlur={handlePassBlur}
                  />
                ))
                : profileInputs.map(({ id, type, placeholder, text }) => (
                  <FormField
                    key={id}
                    id={id}
                    placeholder={placeholder}
                    type={type}
                    text={text}
                    isReadonly={!isEditing}
                    errorMessage={formData[id].errorText}
                    value={formData[id].value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                ))}
            </div>
            {(isEditing || isPasswordMode) && (
            <div className={style.profilePage__form__actions}>
              <CustomButton
                className={[style.button__cancel]}
                type="button"
                color="transparent"
                text="Отмена"
                onClick={() => handleCancel()}
              />

              <CustomButton
                type="submit"
                color="transparent"
                text="Сохранить"
                isDisabled={isPasswordMode ? !isPassFormValid : !isFormValid}
                onClick={isPasswordMode ? handlePasswordSubmit : handleSubmit}
              />
            </div>
            )}
          </form>
        </div>

        <Popup isOpen={isPopupOpen} title="Загрузка аватара" onClose={() => setPopupOpen(false)}>
          <label htmlFor="file">
            Выберите файл:
            <input type="file" id="file" onChange={handleFileChange} />
          </label>
        </Popup>
      </section>
    </>
  );
}

export default memo(ProfilePage);
