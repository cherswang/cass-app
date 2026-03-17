
export interface UserState {
    token: string,
    name: string,
    nickname: string,
    userid: string,
    avatar: string,
    roles: Array<string>
    permissions: Array<string>
}

export interface UserForm {
	// tenantId: string
    username: string
    password: string
    code: string
    // uuid: string
}


