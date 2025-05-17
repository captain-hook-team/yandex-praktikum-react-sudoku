import { API_URL } from '../../config/ApiConfig';
import { BaseApi } from './BaseApi';

export interface IReqData {
  [key: string]: string | number | FormData,
}

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
};

class AuthApi extends BaseApi {
  constructor() {
    super({
      headers: HEADERS,
      baseUrl: API_URL,
      endpoint: '/auth',
    });
  }

  public signUp(data: IReqData) {
    return this.post('/signup', { body: JSON.stringify(data) });
  }

  public signIn(data: IReqData) {
    return this.post('/signin', { body: JSON.stringify(data) });
  }

  public getUser() {
    return this.get('/user');
  }

  public logout() {
    return this.post('/logout');
  }
}

const authApi = new AuthApi();
export default authApi;
