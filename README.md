# BGM Board Game Club Homepage

이 저장소는 BGM(보드게임 동호회)의 공식 홈페이지를 위한 코드를 포함하고 있습니다. [Next.js 13](https://nextjs.org/) 기반으로 제작되었습니다.
https://bgm.namssy.com 에서 서비스되고있습니다.

## 주요 기능

### Chess 경로 (`/chess`)

- 체스 경기 결과를 기록할 수 있는 페이지
- 리더보드를 통해 선수들의 순위와 점수를 확인할 수 있는 페이지

## 개발을 위한 세팅
개발을 시작하기 위해서 아래의 명령어를 사용하세요:
```bash
npm install -g yarn
yarn install

## ORM 
# ref: https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client
npx prisma generate
```

또한 필요한 환경변수를 .env 혹은 .env.local에 저장하세요 아래 환경 변수가 필요합니다.
```dotenv
## ORM
# ref: https://www.prisma.io/docs/reference/database-reference/connection-urls
DATABASE_URL=
## Authorization
# ref: https://next-auth.js.org/configuration/options
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

## 개발 시작하기

개발 서버를 실행하려면 아래의 명령어를 사용하세요:

```bash
yarn dev
```

http://localhost:4000 주소를 브라우저로 열면 결과를 볼 수 있습니다.

## 배포
현재 Docker Swarm으로 관리되고 있습니다. 아래는 docker compose 예시 입니다.

```yaml
version: '3'

services:
  db:
    image: postgres:15.4
    restart: always
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: 
      POSTGRES_PASSWORD: 
      POSTGRES_DB: 
      TZ: Asia/Seoul
    ports:
      - 5432:5432
      
  web:
    image: namssy/bgm-home
    restart: always
    ports:
      - 3000:3000
    depends_on:
      - db
    environment:
      DATABASE_URL:
      GOOGLE_CLIENT_ID: 
      GOOGLE_CLIENT_SECRET: 
      NEXTAUTH_URL: 
      NEXTAUTH_SECRET:
      TZ: Asia/Seoul

volumes:
  pgdata:
```



## 사용된 기술 스택

- Next.js
  - Version 13 
  - App router
- Tailwind CSS
- Prisma
  - postgresql
- Docker
  - Docker swarm
  - Portainer
- GitHub Action
