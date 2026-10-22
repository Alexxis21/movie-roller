import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const libsql = createClient({
  url: 'file:dev.db',
});

const adapter = new PrismaLibSql(libsql);
export const prisma = new PrismaClient({ adapter });
