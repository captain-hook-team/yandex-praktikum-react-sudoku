import { API_URL } from '../../config/ApiConfig';
import { BaseApi } from './BaseApi';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
};

export interface IReqData {
  [key: string]: string | number | FormData,
}

class UserApi extends BaseApi {
  constructor() {
    super({
      headers: HEADERS,
      baseUrl: API_URL,
      endpoint: '/user',
    });
  }

  public updateProfile(data: IReqData) {
    return this.put('/profile', { body: JSON.stringify(data) });
  }

  public changeAvatar(data: FormData) {
    return this.put('/profile/avatar', { headers: {}, body: data });
  }

  public changePassword(data: IReqData) {
    return this.put('/password', { body: JSON.stringify(data) });
  }
}

const userApi = new UserApi();
export default userApi;
