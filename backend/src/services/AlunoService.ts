import { PrismaClient, Aluno } from '@prisma/client';

const prisma = new PrismaClient();

export class AlunoService {
    async criarAluno(pessoa_id: string): Promise<Aluno> {
        return prisma.aluno.create({
            data: { pessoa_id },
            include: { pessoa: true },
        });
    }

    async listarAlunos(): Promise<Aluno[]> {
        return prisma.aluno.findMany({
            include: { pessoa: true },
        });
    }

    async buscarPorId(id: string): Promise<Aluno | null> {
        return prisma.aluno.findUnique({
            where: { id },
            include: { pessoa: true, matriculas: true },
        });
    }

    async atualizarAluno(id: string, pessoa_id: string): Promise<Aluno> {
        return prisma.aluno.update({
            where: { id },
            data: { pessoa_id },
            include: { pessoa: true },
        });
    }

    async deletarAluno(id: string): Promise<Aluno> {
        return prisma.aluno.delete({ where: { id } });
    }
}
