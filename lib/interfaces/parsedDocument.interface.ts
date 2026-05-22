import type { IArticle } from "./article.interface";

export interface IImage {
  src: string;
  alt: string;
  hasAltText: boolean;
  isGoogleDriveHosted: boolean;
}

export interface ILink {
  href: string;
  anchorText: string;
  isExternal: boolean;
  isProductLink: boolean;
}

export interface IParsedDocument {
  article: IArticle;
  images: IImage[];
  links: ILink[];
}
