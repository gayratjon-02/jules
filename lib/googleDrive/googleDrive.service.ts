import { Readable } from "node:stream";
import { google, type drive_v3 } from "googleapis";
import {
  ErrorMessage,
  GoogleApiVersion,
  GoogleDriveField,
  GoogleDriveQueryAlt,
  GoogleEnvVar,
  GoogleResponseType,
  GoogleScope,
  MimeType,
} from "@/lib/enums";

const PRIVATE_KEY_NEWLINE_PATTERN = /\\n/g;
const PRIVATE_KEY_NEWLINE_REPLACEMENT = "\n";

export interface DriveFileStream {
  stream: ReadableStream<Uint8Array>;
  mimeType: string;
}

export class GoogleDriveService {
  private readonly drive: drive_v3.Drive;

  constructor() {
    const email = process.env[GoogleEnvVar.SERVICE_ACCOUNT_EMAIL];
    const rawPrivateKey = process.env[GoogleEnvVar.PRIVATE_KEY];

    if (!email || !rawPrivateKey) {
      throw new Error(ErrorMessage.AUTH_CONFIG_MISSING);
    }

    const privateKey = rawPrivateKey.replace(
      PRIVATE_KEY_NEWLINE_PATTERN,
      PRIVATE_KEY_NEWLINE_REPLACEMENT,
    );

    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: [GoogleScope.DRIVE_READONLY],
    });

    this.drive = google.drive({ version: GoogleApiVersion.DRIVE_V3, auth });
  }

  async fetchFile(fileId: string): Promise<DriveFileStream> {
    try {
      const metadata = await this.drive.files.get({
        fileId,
        fields: GoogleDriveField.MIME_TYPE,
      });
      const mimeType = metadata.data.mimeType ?? MimeType.OCTET_STREAM;

      const response = await this.drive.files.get(
        { fileId, alt: GoogleDriveQueryAlt.MEDIA },
        { responseType: GoogleResponseType.STREAM },
      );

      const nodeStream = response.data as Readable;
      const stream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

      return { stream, mimeType };
    } catch (error) {
      throw new Error(ErrorMessage.IMAGE_PROXY_FETCH_FAILED, { cause: error });
    }
  }
}
