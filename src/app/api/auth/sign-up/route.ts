import { auth } from "@/auth/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const signUpRequestSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6)
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;
        
        const parseResult = signUpRequestSchema.safeParse({ name, email, password });
        if (!parseResult.success) {
            return NextResponse.json(
                { error: "Invalid input. Please provide a valid name, email and password." }, 
                { status: 400 }
            );
        }

        const authResponse = await auth.api.signUpEmail({
            body: { name, email, password },
            headers: request.headers,
            asResponse: true,
            
        });

        const authBody = await authResponse.json();
        const response = NextResponse.json(
            {
                success: authResponse.ok,
                message: authResponse.ok ? "Signed up successfully" : "Sign up failed",
                user: authBody?.user,
                error: authBody?.message,
            },
            { status: authResponse.status }
        );

        const setCookieHeader = authResponse.headers.get("set-cookie");
        if (setCookieHeader) {
            response.headers.set("set-cookie", setCookieHeader);
        }

        return response;

    } catch (error: unknown) {
        console.error("Sign Up Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Sign up failed." },
            { status: 500 }
        );
    }
}