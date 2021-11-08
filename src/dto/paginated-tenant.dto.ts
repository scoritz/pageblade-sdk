import { PaginatedBaseDto } from './paginated-base.dto';

export type PaginatedTenantDto = PaginatedBaseDto & {
    orderBy: 'whenCreated';
}
