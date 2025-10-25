import { Request, Response } from 'express';
import { AlunoService } from '@/services/AlunoService';

const alunoService = new AlunoService();

// DTOs simples para tipar body/params localmente
type CreateAlunoDTO = { pessoa_id?: string };
type UpdateAlunoDTO = { pessoa_id?: string };
type IdParams = { id?: string };

export class AlunoController {
    async criar(req: Request, res: Response): Promise<Response> {
        try {
            const { pessoa_id } = req.body as CreateAlunoDTO;

            if (typeof pessoa_id !== 'string' || pessoa_id.trim() === '') {
                return res.status(400).json({ erro: 'O campo pessoa_id é obrigatório e deve ser string.' });
            }

            const aluno = await alunoService.criarAluno(pessoa_id);
            return res.status(201).json(aluno);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async listarTodos(_req: Request, res: Response): Promise<Response> {
        try {
            const alunos = await alunoService.listarAlunos();
            return res.status(200).json(alunos);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params as IdParams;
            if (typeof id !== 'string' || id.trim() === '') {
                return res.status(400).json({ erro: 'Parâmetro id inválido.' });
            }

            const aluno = await alunoService.buscarPorId(id);
            if (!aluno) {
                return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
            }

            return res.status(200).json(aluno);
        } catch (error: any) {
            return res.status(500).json({ erro: error.message });
        }
    }

    async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params as IdParams;
            const { pessoa_id } = req.body as UpdateAlunoDTO;

            if (typeof id !== 'string' || id.trim() === '') {
                return res.status(400).json({ erro: 'Parâmetro id inválido.' });
            }
            if (typeof pessoa_id !== 'string' || pessoa_id.trim() === '') {
                return res.status(400).json({ erro: 'O campo pessoa_id é obrigatório e deve ser string.' });
            }

            const aluno = await alunoService.atualizarAluno(id, pessoa_id);
            return res.status(200).json(aluno);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async deletar(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params as IdParams;
            if (typeof id !== 'string' || id.trim() === '') {
                return res.status(400).json({ erro: 'Parâmetro id inválido.' });
            }

            await alunoService.deletarAluno(id);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}
