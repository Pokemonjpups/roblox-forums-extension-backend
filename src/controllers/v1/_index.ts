import {Forum} from '../../dal/forum';
import {Auth} from '../../dal/auth';
import { BadRequest, Conflict, Unauthorized } from 'ts-httpexceptions';

export default class Controller {
    public Forum: Forum = new Forum();
    public Auth: Auth = new Auth();

    public BadRequest = BadRequest;
    public Conflict = Conflict;
    public Unauthorized = Unauthorized;
}