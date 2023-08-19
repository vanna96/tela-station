import CurrentUser from "../model/CurrenctUser";
import request from "@/utilies/request";


export default class GetCurrentUserRepository {
    static async post(): Promise<CurrentUser> {
        const response: any = await request('POST', 'UsersService_GetCurrentUser');

        return new CurrentUser(response.data);
    }
}