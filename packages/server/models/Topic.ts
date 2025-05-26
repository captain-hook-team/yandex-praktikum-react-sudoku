import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../src/sequelize/sequelize';
import Message from './Message';
import Folder from './Folder';

class Topic extends Model {
  public topic_id!: number;

  public folder_id!: number;

  public topic_name!: string;

  public topic_descr!: string;

  public messages_count!: number;

  public Messages?: Message[];

  public static override associations: {
        messages: Association<Topic, Message>
    };
}

Topic.init(
  {
    topic_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    folder_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    topic_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic_descr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messages_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'Topics',
    timestamps: false,
    hooks: {
      async afterCreate(topic) {
        await Folder.increment('topics_count', {
          where: { folder_id: topic.folder_id },
        });
      },
      async afterDestroy(topic) {
        await Folder.decrement('topics_count', {
          where: { folder_id: topic.folder_id },
        });
      },
    },
  }
);

Folder.hasMany(Topic, { foreignKey: 'folder_id' });
Topic.belongsTo(Folder, { foreignKey: 'folder_id' });

export default Topic;
