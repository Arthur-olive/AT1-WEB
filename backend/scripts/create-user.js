import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const [,, email, password, name] = process.argv;

    if (!email || !password) {
        console.error("Uso: node scripts/create-user.js <email> <password> [name]");
        process.exit(1);
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, password: hash, name: name ?? null },
    });

    console.log("Usuário criado:", { id: user.id, email: user.email, name: user.name });
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
