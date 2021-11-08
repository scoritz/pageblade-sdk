import { PaginatedBaseDto } from './paginated-base.dto';

export type PaginatedAssetDto = PaginatedBaseDto & {
    websiteId: string;
    orderBy: 'whenCreated' | 'slug' | 'size' | 'filename',
};
