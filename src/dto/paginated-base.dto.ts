
export enum ORDER_DIRECTION {
    ASC = 'asc',
    DESC = 'desc',
}

export type PaginatedBaseDto = {
    pageIndex?: number;
    pageSize?: number;
    keyword?: string;
    orderDirection?: ORDER_DIRECTION;
};

