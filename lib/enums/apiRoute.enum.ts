export enum ApiRoute {
  DOCUMENT = "/api/document",
  UPLOAD = "/api/upload",
  IMAGE_PROXY = "/api/image-proxy",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
}

export enum HttpHeader {
  CONTENT_TYPE = "Content-Type",
  CACHE_CONTROL = "Cache-Control",
}

export enum MimeType {
  JSON = "application/json",
  OCTET_STREAM = "application/octet-stream",
  HTML = "text/html",
}

export enum ApiQueryParam {
  FILE_ID = "fileId",
  DOC_ID = "docId",
}

export enum FetchErrorName {
  ABORT = "AbortError",
}
