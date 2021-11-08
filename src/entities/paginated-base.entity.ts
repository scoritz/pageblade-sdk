
export type PaginatedBaseEntity<T> = {
    nextPageUrl: string;
    orderBy: string;
    pageIndex: number;
    pageSize: number;
    rows: T[];
    totalPagesCount: number;
    totalRowsCount: number;
};
