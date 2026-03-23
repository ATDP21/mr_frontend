type AppUrls = {
    API_BASE_URL: string;
    OAUTH2_REDIRECT_URI: string;
};

type AppConfig = {
    url: AppUrls;
};

const prod: AppConfig = {
    url: {
        API_BASE_URL: "https://mybeapp.herokuapp.com",
        OAUTH2_REDIRECT_URI: "https://myfeapp.herokuapp.com/oauth2/redirect",
    },
};

const dev: AppConfig = {
    url: {
        API_BASE_URL: "http://localhost:8080",
        OAUTH2_REDIRECT_URI: "http://localhost:3000/oauth2/redirect",
    },
};

export const config: AppConfig =
    process.env.NODE_ENV === "development" ? dev : prod;