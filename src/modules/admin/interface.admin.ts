export interface IUpdateUserStatusPayload {
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED" | "DELETED";
}

export interface IAdminQuery {
    page?: string;
    limit?: string;
    searchTerm?: string;
    status?: string;
    city?: string;
    sortBy?: string;
    sortOrder?: string;
}
