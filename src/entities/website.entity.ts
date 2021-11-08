
export type WebsiteEntity = {
    cname: string;
    description: string;
    domain: string;
    domainVerificationKey: string;
    domainVerificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED';
    enabled: boolean;
    hostedUrl: string;
    id: string;
    name: string;
    subdomain: string;
    tenantId: string;
    whenCreated: number;
    whenDomainVerificationAttempted: number;
    whenUpdated: number;
};
