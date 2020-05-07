import knex from '../helpers/knex';
import Knex = require('knex'); // used for types
import axios, { AxiosInstance } from 'axios';
import jsonwebtoken = require('jsonwebtoken');
import config from '../helpers/config';
import moment = require('moment');

export default class Dal {
    public knex: Knex = knex;
    public axios: AxiosInstance = axios;
    public jwt = jsonwebtoken;
    protected config = config;
    public moment = moment;
    constructor() {
        // Nothing, for now
    }
}