import { Prisma, PrismaClient } from "@prisma/client";

/*eslint-disable no-var*/
declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

prisma.$use(async (parms, next) => {
  const result = await next(parms);

  function convertDecimal<t>(obj: t): t {
    if (obj == null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return obj.map(convertDecimal) as t;
    }

    if (typeof obj === "object") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newObj: any = { ...obj };
      for (const key in newObj) {
        if (obj[key] instanceof Prisma.Decimal) {
          obj[key] = Number(obj[key]);
        } else if (typeof obj[key] === "object") {
          obj[key] = convertDecimal(obj[key]);
        }
      }
    }
    return obj;
  }
  return convertDecimal(result);
});

export const db = prisma;
