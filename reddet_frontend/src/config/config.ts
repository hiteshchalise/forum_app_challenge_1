const config = {
  API_URL: process.env.NODE_ENV === 'production' ? 'https://reddet.herokuapp.com' : 'http://localhost:5000',
};
export default config;
