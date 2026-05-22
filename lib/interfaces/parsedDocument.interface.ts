import type { IArticle } from "./article.interface";

export interface IImage {
  src: string;
  alt: string;
}

export interface ILink {
  href: string;
  text: string;
  isExternal: boolean;
}

export interface IParsedDocument {
  article: IArticle;
  images: IImage[];
  links: ILink[];
}
