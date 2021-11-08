import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {API_URL} from "./defaultConfig";
import {
    API_METHODS,
    GameTypes,
    ApiConfig,
    CreateOrderResponse,
    OrderStatusResponse,
    OrdersStatusResponse,
    ServerStatusResponse,
    CallbackErrorListResponse,
    PriceListResponse,
    FindItemsResponse, BuyItemResponse, BoughtItemResponse, BoughtItemsHistoryResponse
} from "./types";

class API {
    private static axios: AxiosInstance;
    private readonly config: ApiConfig;
    private axios: AxiosInstance;

    constructor(apiConfig: ApiConfig) {
        this.config = apiConfig;
        this.axios = axios.create({
            baseURL: this.config.apiUrl || API_URL,
        })
        API.interceptorsInit.call(this, this.config);
    }

    private static interceptorsInit (apiConfig: ApiConfig) {
        this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
            config.headers.Token = apiConfig.auth_token;

            return config;
        },error => Promise.reject(error));

        // Response interceptor
        this.axios.interceptors.response.use((response: AxiosResponse) => {
            // When received error, response has status 200? but it has status field in response body with error
            // or fail status. Interceptor checks status in response body and call reject if
            // status fail or error and write Promise value as response body
            if (response.data.status === 'error' || response.data.status === 'fail') {
                return Promise.reject(response.data);
            }
            return response.data;
        },error => {
            return Promise.reject(error)
        });
    }

    public getBalance = () => {
        return this.axios.post('', {method: API_METHODS.BALANCE})
    }

    public getCurrencies = () => {
        return this.axios.post('', {method: API_METHODS.GET_CURRENCIES})
    }

    public getOrders = ({
        starting,
        ending
    }: {starting: number, ending: number}): Promise<OrdersStatusResponse> => {
        return this.axios.post('', {starting, ending, method: API_METHODS.GET_ORDERS})
    }

    public getOrderStatusByTransactionId = (transaction_id: number | string): Promise<OrderStatusResponse> => {
        return this.axios.post('', {transaction_id, method: API_METHODS.GET_ORDER_STATUS})
    }

    public getOrderStatusByOrderId = (order_id: number): Promise<OrderStatusResponse> => {
        return this.axios.post('', {order_id, method: API_METHODS.GET_ORDER_STATUS})
    }

    public createOrder = (order_id: number): Promise<CreateOrderResponse> => {
        return this.axios.post('', {order_id, method: API_METHODS.CREATE_ORDER})
    }

    public serverStatus = (): Promise<ServerStatusResponse> => {
        return this.axios.post('', {method: API_METHODS.GET_SERVER_STATUS})
    }

    public getErrorCallbackList = (): Promise<CallbackErrorListResponse> => {
        return this.axios.post('', {method: API_METHODS.GET_ERROR_CALLBACK_ERROR_LIST})
    }

    public getMarketPriceList = (game: GameTypes = 'csgo'): Promise<PriceListResponse> => {
        return this.axios.post('', {game, method: API_METHODS.GET_MARKET_PRICE_LIST})
    }

    public findItemsByName = (name: string, game: GameTypes = 'csgo'): Promise<FindItemsResponse> => {
        return this.axios.post('', {name, game, method: API_METHODS.SEARCH_ITEMS})
    }

    public buyItemByNameAndSendToUser = (
        data: {partner: string, token: string, max_price: number, name: string, game: GameTypes}
    ): Promise<BuyItemResponse> => {
        return this.axios.post('', {...data, method: API_METHODS.BUY_ITEM_AND_SEND})
    }

    public buyItemByIdAndSendToUser = (
        data: {partner: string, token: string, max_price: number, id: number | string}
    ): Promise<BuyItemResponse> => {
        return this.axios.post('', {...data, method: API_METHODS.BUY_ITEM_AND_SEND})
    }

    public getInfoAboutBoughtItem = (buy_id: string | number): Promise<BoughtItemResponse> => {
        return this.axios.post('', {buy_id, method: API_METHODS.GET_INFO_ABOUT_BOUGHT_ITEM})
    }

    public getBoughtItemsHistory = ({
        starting,
        ending
    }: {starting: number, ending: number}): Promise<BoughtItemsHistoryResponse> => {
        return this.axios.post('', {starting, ending, method: API_METHODS.GET_INFO_ABOUT_BOUGHT_ITEM})
    }

}

export default API;