/* eslint-disable camelcase */
import { Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import Topic from '../../models/Topic';
import Message from '../../models/Message';
import Folder from '../../models/Folder';

export const getAllFolders = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const folders = await Folder.findAll({
      attributes: ['folder_id', 'folder_name', 'folder_descr', 'topics_count'],
    });

    if (folders.length === 0) {
      res.status(200).json([]);
    } else {
      res.status(200).json(folders);
    }
  } catch (error) {
    res.status(500).json({ error: 'Произошла ошибка' });
  }
};

export const addFolder = async (req: Request, res: Response): Promise<void> => {
  const { folder_name, folder_descr } = req.body;

  if (!folder_name || !folder_descr) {
    res
      .status(400)
      .json({ message: 'Обязательны оба параметра: folder_name и folder_descr.' });
    return;
  }

  try {
    const newFolder = await Folder.create({
      folder_name,
      folder_descr,
    });

    res.status(201).json({ message: 'Папка создана', data: newFolder });
  } catch (error) {
    res.status(500).json({ error: 'Произошла ошибка' });
  }
};

export const getAllTopics = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const topics = await Topic.findAll({
      attributes: ['topic_id', 'topic_name', 'topic_descr', 'messages_count'],
    });

    if (topics.length === 0) {
      res.status(200).json([]);
    } else {
      res.status(200).json(topics);
    }
  } catch (error) {
    res.status(500).json({ error: 'Произошла ошибка' });
  }
};

export const addTopic = async (req: Request, res: Response): Promise<void> => {
  const { topic_name, topic_descr } = req.body;

  if (!topic_name || !topic_descr) {
    res
      .status(400)
      .json({ message: 'Обязательны оба параметра: topic_name и topic_descr.' });
    return;
  }

  try {
    const newTopic = await Topic.create({
      topic_name,
      topic_descr,
    });

    res.status(201).json({ message: 'Топик создан', data: newTopic });
  } catch (error) {
    res.status(500).json({ error: 'Произошла ошибка' });
  }
};

export const getTopic = async (req: Request, res: Response): Promise<void> => {
  const { topic_id } = req.params;

  try {
    const topic = await Topic.findOne({
      where: { topic_id },
      include: [
        {
          model: Message,
        },
      ],
    });

    if (!topic) {
      res.status(404).json({ message: 'Топик не найден' });
    } else {
      const topicMessages = topic.Messages?.map((message) => ({
        user_name: message.user_name,
        message_text: message.message_text,
        message_id: message.message_id,
      }));
      const response = {
        topic_id: topic.topic_id,
        folder_id: topic.folder_id,
        topic_name: topic.topic_name,
        topic_descr: topic.topic_descr,
        messages_count: topic.messages_count,
        messages: topicMessages,
      };
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ error: 'Произошла ошибка' });
  }
};

export const addMessageToTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { topic_id } = req.params;
  const { user_name } = req.body;
  const sanitizedMessageText = sanitizeHtml(req.body.message_text, {
    allowedTags: [],
    allowedAttributes: {},
  });

  try {
    const topic = await Topic.findByPk(topic_id);

    if (!topic) {
      res.status(404).json({ message: 'Топик не найден' });
    } else {
      const newMessage = await Message.create({
        topic_id,
        user_name,
        message_text: sanitizedMessageText,
      });

      topic.messages_count += 1;
      await topic.save();

      const response = {
        message: 'Сообщение добавлено',
        data: {
          message_id: newMessage.message_id,
          topic_id: newMessage.topic_id,
          user_name: newMessage.user_name,
          message_text: newMessage.message_text,
        },
      };
      res.status(201).json(response);
    }
  } catch (error) {
    res.status(500).json({ error: 'Произошла ошибка' });
  }
};
