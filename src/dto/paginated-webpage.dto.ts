import { PaginatedBaseDto } from './paginated-base.dto';

export type PaginatedWebpageDto = PaginatedBaseDto & {
    websiteId: string;
    orderBy: 'whenCreated'
        | 'whenUpdated'
        | 'whenPublished'
        | 'slug'
        | 'redirectUrl'
};
