
export type TenantBaseDto = {
    name: string;
    bandwidthLimitMb?: number;
    storageLimitMb?: number;
    websitesLimit?: number;
    websitePagesLimit?: number;
    websiteAssetsLimit?: number;
    customDomains?: boolean;
};

export type TenantCreateDto = TenantBaseDto;
export type TenantUpdateDto = Partial<TenantBaseDto>;
