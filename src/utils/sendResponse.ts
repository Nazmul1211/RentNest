import type { Response } from "express";


type Tmeta = {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

type TresponseData <T> = {
    success: boolean;
    statusCode: number;
    message: string;
    meta? : Tmeta;
    data: T;
}

export const sendResponse = <T> (res: Response, data : TresponseData<T> ) => {
    res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        meta: data.meta,
        data: data.data
    })
}

