"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const defaultConfig_1 = require("./defaultConfig");
const types_1 = require("./types");
class API {
    constructor(apiConfig) {
        this.getBalance = () => {
            return this.axios.post('', { method: types_1.API_METHODS.BALANCE });
        };
        this.getCurrencies = () => {
            return this.axios.post('', { method: types_1.API_METHODS.GET_CURRENCIES });
        };
        this.getOrders = ({ starting, ending }) => {
            return this.axios.post('', { starting, ending, method: types_1.API_METHODS.GET_ORDERS });
        };
        this.getOrderStatusByTransactionId = (transaction_id) => {
            return this.axios.post('', { transaction_id, method: types_1.API_METHODS.GET_ORDER_STATUS });
        };
        this.getOrderStatusByOrderId = (order_id) => {
            return this.axios.post('', { order_id, method: types_1.API_METHODS.GET_ORDER_STATUS });
        };
        this.createOrder = (order_id) => {
            return this.axios.post('', { order_id, method: types_1.API_METHODS.CREATE_ORDER });
        };
        this.serverStatus = () => {
            return this.axios.post('', { method: types_1.API_METHODS.GET_SERVER_STATUS });
        };
        this.getErrorCallbackList = () => {
            return this.axios.post('', { method: types_1.API_METHODS.GET_ERROR_CALLBACK_ERROR_LIST });
        };
        this.getMarketPriceList = (game = 'csgo') => {
            return this.axios.post('', { game, method: types_1.API_METHODS.GET_MARKET_PRICE_LIST });
        };
        this.findItemsByName = (name, game = 'csgo') => {
            return this.axios.post('', { name, game, method: types_1.API_METHODS.SEARCH_ITEMS });
        };
        this.buyItemByNameAndSendToUser = (data) => {
            return this.axios.post('', { ...data, method: types_1.API_METHODS.BUY_ITEM_AND_SEND });
        };
        this.buyItemByIdAndSendToUser = (data) => {
            return this.axios.post('', { ...data, method: types_1.API_METHODS.BUY_ITEM_AND_SEND });
        };
        this.getInfoAboutBoughtItem = (buy_id) => {
            return this.axios.post('', { buy_id, method: types_1.API_METHODS.GET_INFO_ABOUT_BOUGHT_ITEM });
        };
        this.getBoughtItemsHistory = ({ starting, ending }) => {
            return this.axios.post('', { starting, ending, method: types_1.API_METHODS.GET_INFO_ABOUT_BOUGHT_ITEM });
        };
        this.config = apiConfig;
        this.axios = axios_1.default.create({
            baseURL: this.config.apiUrl || defaultConfig_1.API_URL,
        });
        API.interceptorsInit.call(this, this.config);
    }
    static interceptorsInit(apiConfig) {
        this.axios.interceptors.request.use((config) => {
            config.headers.Token = apiConfig.auth_token;
            return config;
        }, error => Promise.reject(error));
        // Response interceptor
        this.axios.interceptors.response.use((response) => {
            // When received error, response has status 200? but it has status field in response body with error
            // or fail status. Interceptor checks status in response body and call reject if
            // status fail or error and write Promise value as response body
            if (response.data.status === 'error' || response.data.status === 'fail') {
                return Promise.reject(response.data);
            }
            return response.data;
        }, error => {
            return Promise.reject(error);
        });
    }
}
exports.default = API;
