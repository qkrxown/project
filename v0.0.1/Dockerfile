# FROM 리눅스:최신버전 처럼 베이스를 정하는 구문
# node:14는 node, npm, yarn이 설치되어있는 베이스
FROM node:14 
WORKDIR /V0.0.1
# 
COPY . .
RUN npm i --production
CMD ["node", "dist/main.js"]
EXPOSE 3000



# # Build target production #
# ###########################
# FROM base AS production
# ARG APP_VERSION=master
# ENV APP_VERSION $APP_VERSION
# COPY --from=builder /app/dist /app/dist
# COPY --from=dependencies /app/node_modules /app/node_modules
# COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

# # Don't run as root
# USER 1000:1001

# # Start the app
# CMD node /app/dist/apps/$TARGET_APP/main.js