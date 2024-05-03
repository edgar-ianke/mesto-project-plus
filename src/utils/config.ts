const { PORT = 3000, DB = 'mongodb://localhost:27017/mestodb', SECRET_KEY = 'some-secret-key' } = process.env;
export { PORT, DB, SECRET_KEY };
