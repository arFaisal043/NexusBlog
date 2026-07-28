import type { NextFunction, Request, Response } from "express";

// _______ Catch Async is a --> Higher Order Function

// catch async function return a req res 
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


/*
Higher Order Function (HOF)
  - A Higher Order Function is a function that does at least one of the following:

1. Takes one or more functions as arguments
2. Returns a function as its result
*/