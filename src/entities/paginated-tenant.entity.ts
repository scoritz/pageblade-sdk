import { PaginatedBaseEntity } from './paginated-base.entity';
import { TenantEntity } from './tenant.entity';

export type PaginatedTenantEntity = PaginatedBaseEntity<TenantEntity>;
