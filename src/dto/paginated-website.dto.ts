import { PaginatedBaseDto } from './paginated-base.dto';

export type PaginatedWebsiteDto = PaginatedBaseDto & {
    orderBy: 'whenCreated' | 'whenUpdated';
}
