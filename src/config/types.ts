export interface Config {
  api: {
    baseUrl: string;
    timeout: number;
  };
  database: {
    host: string;
    port: number;
    name: string;
  };
  features: {
    enableCache: boolean;
    maxRetries: number;
  };
}
