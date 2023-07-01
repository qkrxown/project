import { INestiaConfig } from "@nestia/sdk";


const config:INestiaConfig = {
    input: "src/**/*.controller.ts",
    swagger:{
        output:"dist/swagger.json",
        security:{
            bearer:{
                type:"apiKey",
                name:"Autorization",
                in:"header",
            }
        },
        servers:[
            {
                url:"http://localhost:3001",
                description:"Local Server"
            }
        ],
    }
};

export default config;