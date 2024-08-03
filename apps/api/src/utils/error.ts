import Elysia from "elysia";
import { MongoServerError } from "mongodb";
import { log } from "../config/setup";

export class GenericApiError extends Error {
  code: string = "UNKNOWN_ERROR";
  status = 500;
}

export class ValidationError extends GenericApiError {
  code: string = "VALIDATION";
  status = 500;
}

export class RecordNotFound extends GenericApiError {
  code: string = "RECORD_NOT_FOUND";
  status = 404;
}

export class AuthorizationError extends GenericApiError {
  code: string = "AUTHORIZATION";
  status = 403;
}

export const isApiError = (error: any): error is GenericApiError => {
  return error instanceof GenericApiError || typeof error.status === "number";
};

export const isMongoError = (error: any): error is MongoServerError => {
  return error instanceof MongoServerError;
};

export const error = () =>
  new Elysia().onError(({ set, error, code }) => {
    if (isApiError(error)) {
      set.status = error.status;
      log.error(`APIERROR server error: ${error.code}`);
    }
    if (isMongoError(error)) {
      set.status = error.status;
      log.error(`MongoDB server error: ${error.code}`);
    }
    set.status = set.status || 500;
    if (code === "VALIDATION") {
      return {
        code: code,
        success: false,
        status: set.status,
        message: JSON.parse(error.message),
      };
    }
    return {
      code: code,
      success: false,
      status: set.status,
      message: error.message,
    };
  });
