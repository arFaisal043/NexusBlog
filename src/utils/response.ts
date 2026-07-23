import type { Response } from "express";

type TMeta = {
    page: number,
    limit: number,
    total: number
}

export const sendSuccess = ( res: Response, statusCode: number, message: string, data?: any, metaData?: TMeta) => {
  res.status(statusCode).json({ 
    success: true, message, data
  });
};

// --- No need this function, bcz globalErrorHandler.ts handling all the error responses for the entire application
// export const sendError = ( res: Response, statusCode: number, message: string, errors?: any) => {
//   res.status(statusCode).json({ success: false, message, errors});
// };



// _______ Another approach

// type TMeta = {
//     page: number,
//     limit: number,
//     total: number
// }

// // generic type for data
// type TResponseData<T> = {
//     success: boolean;
//     statusCode: number;
//     message: string;
//     data: T;
//     meta?: TMeta
// }

// export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
//   res.json({
//     success: data.success,
//     statusCode: data.statusCode,
//     message: data.message,
//     data: data.data,
//     meta: data.meta
//   });
// };