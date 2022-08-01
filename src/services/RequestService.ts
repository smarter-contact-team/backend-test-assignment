import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, Method, AxiosResponse } from "axios";
export { AxiosInstance, AxiosRequestConfig, AxiosError, Method, AxiosResponse };

export interface IRequestService {
    getOptions(requestOptions: AxiosRequestConfig): AxiosRequestConfig;
    GET(url: string, params: object, headers: object): Promise<any>;
}

/**
 * Class that implements abstract API requests with logs and error handling
 * @category API Services
 */
export class RequestService implements IRequestService {
    protected request: AxiosInstance;

    // extra axios options
    protected options: AxiosRequestConfig = {
        timeout: 6000, // default timeout for all services
    };

    constructor() {
        this.request = axios.create();
    }

    /**
     * Get axios options for request that are merged with default options
     * @param requestOptions
     */
    public getOptions(requestOptions: AxiosRequestConfig = {}): AxiosRequestConfig {
        // TODO: need to fix merging headers.
        //  If we call this.GET(url), it means headers = {} that overrides what was in this.options.headers
        const requestConfig: AxiosRequestConfig = Object.assign(JSON.parse(JSON.stringify(this.options)), requestOptions);
        return requestConfig;
    }

    /**
     * Sends abstract GET request
     * @param {string} url - URL to send request
     * @param {object} params - GET-parameters
     * @param {object} headers - JSON for headers
     * @return {object} - response
     */
    public async GET(url: string, params: object = {}, headers: object = {}): Promise<any> {
        return await this.send("get", url, params, undefined, headers);
    }

    /**
     * Sends a request with specified params with logs for process
     * @param {string} method - method of request ( GET, POST, PUT, PATCH, DELETE, OPTIONS )
     * @param {string} url - URL to send request
     * @param {object} params - GET-parameters
     * @param {object} data - POST-data (body)
     * @param {object} headers - JSON for headers
     * @return {any} - server response
     */
    protected async send(method: Method, url: string, params: object = {}, data: any = null, headers: object = {}): Promise<any> {
        const requestOptions = { method, url, params, headers, data } as any;
        return await this._send(this.getOptions(requestOptions));
    }

    /**
     * Transport layer for requests
     * Performs error handling, logs, restoring from cache etc
     * @param {AxiosRequestConfig} requestOptions
     */
    protected async _send(requestOptions: AxiosRequestConfig): Promise<any> {
        let response;
        try {
            response = await this.request(requestOptions);
        } catch (e) {
            console.log(e);
            // TODO Error parse and analyze
            throw e;
        }
        return response.data;
    }
}

