/* eslint-disable semi */
import express from 'express';

export default interface CustomFileRequest<T> extends express.Request {
  file: T;
}
