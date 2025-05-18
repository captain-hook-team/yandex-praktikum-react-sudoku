import { BASE_URL } from '../../config/ApiConfig';
import { BaseApi } from './BaseApi';

export interface IReqData {
  [key: string]: string | number | FormData,
}

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
};

class ReactionApi extends BaseApi {
  constructor() {
    super({
      headers: HEADERS,
      baseUrl: BASE_URL,
      endpoint: '/reactions',
    });
  }

  public setReaction(data: IReqData) {
    return this.put('/reaction', { body: JSON.stringify(data) });
  }
}

const reactionApi = new ReactionApi();
export default reactionApi;
