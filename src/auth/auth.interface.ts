export interface Auth {
    user?: any;
    access_token?: string;
    requires_client_selection?: boolean;
    clients?: any[];
}