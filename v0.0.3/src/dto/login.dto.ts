

export interface LoginDto{

    /**
     * @format email
     */
    email:string

    /**
     * @pattern ^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*_-]+$
     * @minLength 8
     * @maxLength 16
     */
    password:string

    autologin:boolean
}