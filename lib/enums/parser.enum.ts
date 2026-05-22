export enum ParserPattern {
  META_TITLE_PREFIX = "meta title:",
  META_DESC_PREFIX = "meta description:",
  GOOGLE_DRIVE_DOMAIN = "drive.google.com",
  GOOGLE_USERCONTENT_DOMAIN = "googleusercontent.com",
  PRODUCT_URL_SEGMENT = "/product/",
  PRODUCTS_URL_SEGMENT = "/products/",
  SHOP_URL_SEGMENT = "/shop/",
  P_URL_SEGMENT = "/p/",
  ITEM_URL_SEGMENT = "/item/",
  GOOGLE_DRIVE_FILE_PATH = "/file/",
  IMAGE_ANCHOR_PATTERN = "^IMAGE\\s*\\d+$",
  ALT_TAG_PATTERN = "Alt\\s*tag:\\s*[\"\\u201C\\u201D](.+?)[\"\\u201C\\u201D]",
  DRIVE_FILE_ID_FILE_PATH_PATTERN = "/file/d/([a-zA-Z0-9_-]+)",
  DRIVE_FILE_ID_QUERY_PATTERN = "[?&]id=([a-zA-Z0-9_-]+)",
  DRIVE_FILE_ID_D_PATH_PATTERN = "/d/([a-zA-Z0-9_-]+)",
  IMAGE_PROXY_URL_TEMPLATE = "/api/image-proxy?fileId={id}",
  IMAGE_PROXY_PLACEHOLDER = "{id}",
}

export enum HtmlTag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  P = "p",
  A = "a",
  IMG = "img",
}

export enum DocsStyleType {
  TITLE = "TITLE",
  SUBTITLE = "SUBTITLE",
  HEADING_1 = "HEADING_1",
  HEADING_2 = "HEADING_2",
  HEADING_3 = "HEADING_3",
  HEADING_4 = "HEADING_4",
  HEADING_5 = "HEADING_5",
  HEADING_6 = "HEADING_6",
  NORMAL_TEXT = "NORMAL_TEXT",
}
