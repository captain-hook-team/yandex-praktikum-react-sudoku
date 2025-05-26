import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../src/sequelize/sequelize';
import Topic from './Topic';

class Folder extends Model {
  public folder_id!: number;

  public folder_name!: string;

  public folder_descr!: string;

  public topics_count!: number;

  public Topics?: Topic[];

  public static override associations: {
    topics: Association<Folder, Topic>
  };
}

Folder.init(
  {
    folder_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    folder_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    folder_descr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topics_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'Folders',
    timestamps: false,
  }
);

export default Folder;
