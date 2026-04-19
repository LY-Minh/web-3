import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { logService } from "@/server/logs/logService";

export const GET = async (req: NextRequest) => {
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

        const logs = await logService.getAllLogs();

        return NextResponse.json(logs, { status: 200 });
    } catch (error) {
        console.error("Error fetching logs:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
