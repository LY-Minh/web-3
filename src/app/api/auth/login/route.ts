import { NextResponse } from "next/server";
import { auth } from "@/auth/auth"; 
import { z } from "zod";

const loginRequestSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

       const parseResult = loginRequestSchema.safeParse({ email, password });
        if (!parseResult.success) {
            return NextResponse.json(
                { error: "Invalid input. Please provide a valid email and password." }, 
                { status: 400 }
            );
        }
  
        const authResponse = await auth.api.signInEmail({
            body: { email, password },
            headers: request.headers,
            asResponse: true,
        });

        const authBody = await authResponse.json();
        const response = NextResponse.json(
            {
                success: authResponse.ok,
                message: authResponse.ok ? "Logged in successfully" : "Login failed",
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
        console.error("Login Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Invalid credentials." },
            { status: 401 }
        );
    }
}