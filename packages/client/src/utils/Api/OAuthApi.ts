import { API_URL } from '../../config/ApiConfig';
import { BaseApi } from './BaseApi';
import { IReqData } from './AuthApi';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
};

class OAuthApi extends BaseApi {
  constructor() {
    super({
      headers: HEADERS,
      baseUrl: API_URL,
      endpoint: '/oauth',
    });
  }

  public getServiceId() {
    return this.get('/yandex/service-id');
  }

  public signIn(data: IReqData) {
    return this.post('/yandex', { body: JSON.stringify(data) });
  }
}

export default new OAuthApi();
