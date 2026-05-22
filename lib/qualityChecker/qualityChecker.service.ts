import {
  ImageLimit,
  LinkLimit,
  ParagraphLimit,
  QualityCheckId,
  QualityMessage,
  Severity,
  UiLabel,
} from "@/lib/enums";
import type {
  IArticle,
  IImage,
  ILink,
  IParsedDocument,
  IQualityCheck,
  IQualityReport,
} from "@/lib/interfaces";

const PARAGRAPH_TAG_REGEX = /<p[\s>]/gi;
const PLACEHOLDER_REGEX = /\{(\w+)\}/g;

type MessageVars = Record<string, number | string>;

const CHECK_LABELS: Readonly<Record<QualityCheckId, UiLabel>> = {
  [QualityCheckId.IMAGE_COUNT]: UiLabel.QUALITY_CHECK_IMAGE_COUNT,
  [QualityCheckId.IMAGE_HOSTING]: UiLabel.QUALITY_CHECK_IMAGE_HOSTING,
  [QualityCheckId.IMAGE_ALT_TAGS]: UiLabel.QUALITY_CHECK_IMAGE_ALT_TAGS,
  [QualityCheckId.LINK_COUNT]: UiLabel.QUALITY_CHECK_LINK_COUNT,
  [QualityCheckId.ARTICLE_TITLE]: UiLabel.QUALITY_CHECK_ARTICLE_TITLE,
  [QualityCheckId.META_TITLE]: UiLabel.QUALITY_CHECK_META_TITLE,
  [QualityCheckId.META_DESCRIPTION]: UiLabel.QUALITY_CHECK_META_DESCRIPTION,
  [QualityCheckId.ARTICLE_HTML]: UiLabel.QUALITY_CHECK_ARTICLE_HTML,
};

function formatMessage(template: QualityMessage, vars: MessageVars = {}): string {
  return template.replace(PLACEHOLDER_REGEX, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export class QualityCheckerService {
  check(parsed: IParsedDocument): IQualityReport {
    const checks: IQualityCheck[] = [
      this.checkImageCount(parsed.images),
      this.checkImageHosting(parsed.images),
      this.checkImageAltTags(parsed.images),
      this.checkLinkCount(parsed.links),
      this.checkArticleTitle(parsed.article),
      this.checkMetaTitle(parsed.article),
      this.checkMetaDescription(parsed.article),
      this.checkArticleHtml(parsed.article),
    ];

    return this.buildReport(checks);
  }

  private checkImageCount(images: IImage[]): IQualityCheck {
    const count = images.length;

    if (count < ImageLimit.MIN_COUNT) {
      return this.buildCheck(
        QualityCheckId.IMAGE_COUNT,
        Severity.FAIL,
        formatMessage(QualityMessage.IMAGE_COUNT_TOO_FEW, {
          count,
          min: ImageLimit.MIN_COUNT,
        }),
      );
    }

    if (count > ImageLimit.MAX_COUNT) {
      return this.buildCheck(
        QualityCheckId.IMAGE_COUNT,
        Severity.WARNING,
        formatMessage(QualityMessage.IMAGE_COUNT_TOO_MANY, {
          count,
          max: ImageLimit.MAX_COUNT,
        }),
      );
    }

    return this.buildCheck(
      QualityCheckId.IMAGE_COUNT,
      Severity.PASS,
      formatMessage(QualityMessage.IMAGE_COUNT_PASS, { count }),
    );
  }

  private checkImageHosting(images: IImage[]): IQualityCheck {
    const offenders = images.filter((image) => !image.isGoogleDriveHosted);

    if (offenders.length === 0) {
      return this.buildCheck(
        QualityCheckId.IMAGE_HOSTING,
        Severity.PASS,
        formatMessage(QualityMessage.IMAGE_HOSTING_PASS),
      );
    }

    return this.buildCheck(
      QualityCheckId.IMAGE_HOSTING,
      Severity.FAIL,
      formatMessage(QualityMessage.IMAGE_HOSTING_FAIL, { count: offenders.length }),
    );
  }

  private checkImageAltTags(images: IImage[]): IQualityCheck {
    const offenders = images.filter((image) => !image.hasAltText);

    if (offenders.length === 0) {
      return this.buildCheck(
        QualityCheckId.IMAGE_ALT_TAGS,
        Severity.PASS,
        formatMessage(QualityMessage.IMAGE_ALT_PASS),
      );
    }

    return this.buildCheck(
      QualityCheckId.IMAGE_ALT_TAGS,
      Severity.FAIL,
      formatMessage(QualityMessage.IMAGE_ALT_FAIL, { count: offenders.length }),
    );
  }

  private checkLinkCount(links: ILink[]): IQualityCheck {
    const count = links.filter((link) => link.isProductLink).length;

    if (count < LinkLimit.MIN_INTERNAL_COUNT) {
      return this.buildCheck(
        QualityCheckId.LINK_COUNT,
        Severity.FAIL,
        formatMessage(QualityMessage.LINK_COUNT_TOO_FEW, {
          count,
          min: LinkLimit.MIN_INTERNAL_COUNT,
        }),
      );
    }

    if (count > LinkLimit.MAX_TOTAL_COUNT) {
      return this.buildCheck(
        QualityCheckId.LINK_COUNT,
        Severity.WARNING,
        formatMessage(QualityMessage.LINK_COUNT_TOO_MANY, {
          count,
          max: LinkLimit.MAX_TOTAL_COUNT,
        }),
      );
    }

    return this.buildCheck(
      QualityCheckId.LINK_COUNT,
      Severity.PASS,
      formatMessage(QualityMessage.LINK_COUNT_PASS, { count }),
    );
  }

  private checkArticleTitle(article: IArticle): IQualityCheck {
    const ok = article.title.trim().length > 0;
    return this.buildCheck(
      QualityCheckId.ARTICLE_TITLE,
      ok ? Severity.PASS : Severity.FAIL,
      formatMessage(
        ok ? QualityMessage.ARTICLE_TITLE_PASS : QualityMessage.ARTICLE_TITLE_FAIL,
      ),
    );
  }

  private checkMetaTitle(article: IArticle): IQualityCheck {
    const ok = article.metaTitle.trim().length > 0;
    return this.buildCheck(
      QualityCheckId.META_TITLE,
      ok ? Severity.PASS : Severity.FAIL,
      formatMessage(ok ? QualityMessage.META_TITLE_PASS : QualityMessage.META_TITLE_FAIL),
    );
  }

  private checkMetaDescription(article: IArticle): IQualityCheck {
    const ok = article.metaDescription.trim().length > 0;
    return this.buildCheck(
      QualityCheckId.META_DESCRIPTION,
      ok ? Severity.PASS : Severity.FAIL,
      formatMessage(
        ok
          ? QualityMessage.META_DESCRIPTION_PASS
          : QualityMessage.META_DESCRIPTION_FAIL,
      ),
    );
  }

  private checkArticleHtml(article: IArticle): IQualityCheck {
    const count = (article.html.match(PARAGRAPH_TAG_REGEX) ?? []).length;

    if (count < ParagraphLimit.MIN_PARAGRAPH_COUNT) {
      return this.buildCheck(
        QualityCheckId.ARTICLE_HTML,
        Severity.FAIL,
        formatMessage(QualityMessage.ARTICLE_HTML_FAIL, {
          count,
          min: ParagraphLimit.MIN_PARAGRAPH_COUNT,
        }),
      );
    }

    return this.buildCheck(
      QualityCheckId.ARTICLE_HTML,
      Severity.PASS,
      formatMessage(QualityMessage.ARTICLE_HTML_PASS, { count }),
    );
  }

  private buildCheck(
    id: QualityCheckId,
    severity: Severity,
    message: string,
  ): IQualityCheck {
    return {
      id,
      label: CHECK_LABELS[id],
      passed: severity === Severity.PASS,
      severity,
      message,
    };
  }

  private buildReport(checks: IQualityCheck[]): IQualityReport {
    let totalPassed = 0;
    let totalWarnings = 0;
    let totalFailed = 0;

    for (const check of checks) {
      if (check.severity === Severity.PASS) totalPassed += 1;
      else if (check.severity === Severity.WARNING) totalWarnings += 1;
      else if (check.severity === Severity.FAIL) totalFailed += 1;
    }

    return {
      checks,
      totalPassed,
      totalWarnings,
      totalFailed,
      overallPassed: totalFailed === 0,
    };
  }
}
