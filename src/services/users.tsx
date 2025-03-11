import { User } from "@/types";
import API from "./api";
import { UserDataResponse } from "./server";



interface ListUsersResponse {
    meta: any
    data: User[]
}


export async function listUsers(query_string: string): Promise<ListUsersResponse> {
    const response = await API.get(`/users?${new URLSearchParams({ query_string })}`);
    return response.data;
}

type EditUserPayload = { id: string, username: string, email: string, role: string, password: string }

export async function editUser({ id, ...rest }: EditUserPayload) {
    await API.put('/users/' + id, rest);
}


export async function syncEditableSeries(user_id: string, series_ids: number[] | string[]) {
    await API.put('/users/' + user_id, { series_ids })
}

export async function getClientUserData() {
    const response = await API.get<UserDataResponse>('/auth/user')
    return response.data;
}

export async function unlinkPatreonAccount(user_id: number) {
    await API.delete('/patreon/delete', {
        data: {
            user_id
        }
    })
}