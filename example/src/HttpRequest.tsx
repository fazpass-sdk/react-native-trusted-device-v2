

export default class HttpRequest<Params> {

    #url: Url

    constructor(api: Url) {
        this.#url = api
    }

    async fetch(body: Params): Promise<any> {
        console.log(body)
        const response = await fetch(this.#url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const json = await response.json()
        return json
    }

}

export enum Url {
    Base = "https://seamless-pub.stg.fazpas.com",
    Check = Base + "/check", 
    Enroll = Base + "/enroll", 
    Validate = Base + "/validate-user", 
    Remove = Base + "/logout"
}

export type CheckParams = {
    phone: string,
    meta: string
}

export type EnrollParams = {
    phone: string,
    meta: string,
    challenge: string
}

export type ValidateParams = {
    phone: string,
    meta: string,
    fazpass_id: string,
    challenge: string
}

export type RemoveParams = {
    phone: string,
    meta: string,
    fazpass_id: string,
    challenge: string
}