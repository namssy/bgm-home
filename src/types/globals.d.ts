import { PrismaClient } from "@prisma/client";
//
// declare var global: typeof globalThis & {
//   prisma: PrismaClient;
// };

declare global {
  var prisma: PrismaClient;
}
