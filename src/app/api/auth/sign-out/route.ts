import { auth } from "@/auth/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await auth.api.signOut({
            headers: request.headers 
        });

        return NextResponse.json({ 
            success: true, 
            message: "Logged out successfully"  
        }, { status: 200 }); 
    }
    catch (error: unknown) {
        console.error("Sign Out Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Sign out failed." }, 
            { status: 500 }
        );
    }
}