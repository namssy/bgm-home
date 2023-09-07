import "server-only";
import { PrismaClient } from "@prisma/client";
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  console.log("new connection");
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    console.log("new connection");
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export default prisma;
