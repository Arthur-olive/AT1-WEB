import { Router } from 'express';
import { AlunoController } from '@/controllers/AlunoController';

const alunoRouter = Router();
const controller = new AlunoController();

// CRUD
alunoRouter.post('/', (req, res) => controller.criar(req, res));
alunoRouter.get('/', (req, res) => controller.listarTodos(req, res));
alunoRouter.get('/:id', (req, res) => controller.buscarPorId(req, res));
alunoRouter.put('/:id', (req, res) => controller.atualizar(req, res));
alunoRouter.delete('/:id', (req, res) => controller.deletar(req, res));

export default alunoRouter;
