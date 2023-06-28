

export interface UserDto {
    
    /**
     * @format email
     */
    email: string;
    
    /**
     * @pattern ^[a-zA-Z0-9가-힣_]+$
     * @minLength 2
     * @maxLength 8
     */
    nickName: string;
    
    /**
     * @pattern ^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*_-]+$
     * @minLength 8
     * @maxLength 16
     */
    password: string;
    
}