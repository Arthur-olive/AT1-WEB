// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is missing (defina em frontend/.env.local)");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET, // <- importante no v5
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                return null;
            },
        }),
    ],
});

export const GET = handlers.GET;
export const POST = handlers.POST;
