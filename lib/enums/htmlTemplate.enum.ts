export enum HtmlTemplate {
  DOCUMENT = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>{title}</title>\n  <meta name=\"description\" content=\"{description}\">\n</head>\n<body>\n{body}\n</body>\n</html>\n",
  TITLE_PLACEHOLDER = "{title}",
  DESCRIPTION_PLACEHOLDER = "{description}",
  BODY_PLACEHOLDER = "{body}",
}
