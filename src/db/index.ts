import SqliteDBManager from './SqliteDBManager';

const DBManagerFactory = () => {
  return new SqliteDBManager();
};

export default DBManagerFactory();