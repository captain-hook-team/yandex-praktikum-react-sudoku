import { Router } from 'express';
import {
  addFolder,
  addMessageToTopic,
  addTopic,
  getAllFolders,
  getAllTopics,
  getTopic,
} from '../controllers/forumController';

const forumRouter = Router();

forumRouter.get('/folders', getAllFolders);
forumRouter.get('/topic/:topic_id', getTopic);
forumRouter.get('/topics', getAllTopics);
forumRouter.post('/folders', addFolder);
forumRouter.post('/topic/:topic_id', addMessageToTopic);
forumRouter.post('/topics', addTopic);

export default forumRouter;
