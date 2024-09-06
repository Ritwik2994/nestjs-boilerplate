export interface IFile {
  iconType?: string;
  isImageUrl?: boolean;
  isUploading?: boolean;
  message?: string;
  name?: string;
  short_filename?: string;
  showDownload?: boolean;
  status?: string;
  uid?: string;
  url: string;
}

export type ILocation = {
  coordinates: [number];
  type: string;
};

export interface GlobalResponse {
  success?: boolean;
  error?: string;
  stack?: string;
  statusCode?: number;
  data?: any;
}

export interface GlobalMessageResponse {
  success: boolean;
  message: string;
}

export interface ISort {
  [key: string]: 1 | -1;
}

export interface ISearchQuery {
  [key: string]: any;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  totalPages: number;
}
