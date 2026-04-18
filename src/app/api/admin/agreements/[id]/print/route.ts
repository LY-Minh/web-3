import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import { auth } from "@/auth/auth";
import { agreementService } from "@/server/agreements/agreementService";

export const runtime = "nodejs";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Agreement id is required" }, { status: 400 });
        }

        const printPayload = await agreementService.getAgreementPrintStream(id, session.user.id);

        if (!printPayload) {
            return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
        }
        // Convert Node.js Readable stream to Web ReadableStream 
        const webStream = Readable.toWeb(
            printPayload.stream as Readable 
        ) as unknown as ReadableStream;

        return new NextResponse(webStream, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${printPayload.fileName}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Error fetching agreement print payload:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
