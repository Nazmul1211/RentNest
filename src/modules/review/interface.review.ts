export interface ICreateReviewPayload {
    rentalRequestId: string;
    rating: number;
    comment: string;
}

export interface IUpdateReviewPayload {
    rating?: number;
    comment?: string;
}
