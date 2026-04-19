import { logRepository } from "./logRepository";

class LogService {
    constructor(private repo: typeof logRepository) {}

    async getAllLogs() {
        return this.repo.getAllLogs();
    }
}

export const logService = new LogService(logRepository);
