interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_API_URL: string;
    readonly SSR: boolean;
}

interface ImportMeta {
    env: ImportMetaEnv;
}