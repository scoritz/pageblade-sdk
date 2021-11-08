
export type StatisticsEntity = {

    bandwidth: {
        limitMb: number;
        usedMb: number;
        remainingMb: number;
    };
    storage: {
        limitMb: number;
        usedMb: number;
        remainingMb: number;
    };
    tenantId?: string;
    tenants?: {
        limit: number;
        used: number;
        remaining: number;
    };
    websites: {
        limit: number;
        used: number;
        remaining: number;
    };
}
