let IS_PROD = true;

const server = IS_PROD
    ? "https://meeting-app-backend-3mlz.onrender.com"
    : "http://localhost:5000";

export default server;
