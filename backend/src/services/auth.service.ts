import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface UserRequest {
    email: string;
    password: string;
}

/** Payload do JWT (claim) */
export interface DataStoredInToken {
    id: string;
    email: string;
}

/** Resposta com token */
interface TokenData {
    access_token: string;
    expires_in: number; // em segundos
    token_type: "Bearer";
}

/** Usuário sem a senha + token */
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    access_token: string;
    expires_in: number;
    token_type: "Bearer";
}

/** Utilitário simples para exigir variável de ambiente */
function getEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

/** Opções e helpers para JWT */
const JWT_EXPIRES_IN_SECONDS = 60 * 60; // 1h
const JWT_SECRET = getEnv("JWT_SECRET"); // falha cedo se não setar

function signJwt(payload: DataStoredInToken): string {
    // Você pode ajustar 'issuer', 'audience' e 'subject' conforme seu domínio
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN_SECONDS,
        algorithm: "HS256",
    });
}

class AuthService {
    public async execute({ email, password }: UserRequest): Promise<AuthResponse> {
        // 1) Buscar usuário por e-mail (trazer somente o necessário)
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                password: true, // precisamos para comparar
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            // Evite vazar se o e-mail existe: mensagem genérica é mais segura em produção
            throw new Error("User not found");
        }

        // 2) Comparar senha
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            // Mesma observação: ideal manter mensagem genérica
            throw new Error("Invalid password");
        }

        // 3) Criar token
        const token = signJwt({ id: user.id, email: user.email });

        // 4) Montar resposta sem a senha
        const { password: _omit, ...safeUser } = user;

        const tokenData: TokenData = {
            access_token: token,
            expires_in: JWT_EXPIRES_IN_SECONDS,
            token_type: "Bearer",
        };

        return {
            user: safeUser,
            ...tokenData,
        };
    }
}

export default new AuthService();
