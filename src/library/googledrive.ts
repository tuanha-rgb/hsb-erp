// src/library/googledrive.ts

// ---- Env helpers ----
function getEnvVar(name: string): string {
  const v = import.meta.env?.[name];
  if (!v) {
    console.warn(`[googledrive] Missing env: ${name}, using empty string`);
    return '';
  }
  return v as string;
}

const FOLDER_ID = getEnvVar('VITE_FOLDER_ID');
const API_KEY   = getEnvVar('VITE_DRIVE_API');

// ---- Types ----
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
}

interface DriveListResponse {
  nextPageToken?: string;
  files?: DriveFile[];
}

// ---- Utils ----
function buildDriveUrl(path: string, params: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`https://www.googleapis.com/drive/v3/${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  return url.toString();
}

// ---- Public media URL for a file (bytes stream) ----
// Works when the file is shared as “Anyone with the link – Viewer”.
export async function getFileUrl(fileId: string): Promise<string> {
  return buildDriveUrl(`files/${encodeURIComponent(fileId)}`, {
    alt: 'media',
    key: API_KEY,
  });
}

// (Optional) Public web view link (Drive viewer UI) – useful for “Open in Drive”
export function getWebViewLink(fileId: string): string {
  // Drive API can return webViewLink, but this direct pattern works without extra call
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`;
}

// ---- List files in a folder (paginated) ----
export async function fetchDriveFiles(options?: {
  pageSize?: number;
  pageToken?: string;
  mimeContains?: string;   // e.g., 'pdf' or 'epub'
  orderBy?: string;        // e.g., 'modifiedTime desc'
}): Promise<DriveListResponse> {
  const { pageSize = 50, pageToken, mimeContains, orderBy = 'modifiedTime desc' } = options || {};

  // Build query: in folder + not trashed + (optional) mime filter
  const qParts = [
    `'${FOLDER_ID}' in parents`,
    'trashed = false',
    mimeContains ? `mimeType contains '${mimeContains.replace(/'/g, "\\'")}'` : '',
  ].filter(Boolean);

  const url = buildDriveUrl('files', {
    key: API_KEY,
    q: qParts.join(' and '),
    pageSize,
    pageToken,
    orderBy,
    // Ask for the fields you’ll actually use
    fields: 'nextPageToken,files(id,name,mimeType,modifiedTime,size,iconLink,thumbnailLink,webViewLink,webContentLink)',
  });

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`[googledrive] list error ${res.status}: ${text || res.statusText}`);
  }
  const data = (await res.json()) as DriveListResponse;
  return {
    nextPageToken: data.nextPageToken,
    files: data.files || [],
  };
}

// ---- Convenience: fetch ALL files in the folder (auto-pagination) ----
export async function fetchAllDriveFiles(options?: {
  mimeContains?: string;
  orderBy?: string;
  pageSize?: number; // per-page size, defaults 100
}): Promise<DriveFile[]> {
  const pageSize = options?.pageSize ?? 100;
  let pageToken: string | undefined = undefined;
  const all: DriveFile[] = [];

  do {
    const page = await fetchDriveFiles({
      pageSize,
      pageToken,
      mimeContains: options?.mimeContains,
      orderBy: options?.orderBy,
    });
    if (page.files?.length) all.push(...page.files);
    pageToken = page.nextPageToken;
  } while (pageToken);

  return all;
}

// ---- (Optional) Get a single file’s metadata (no bytes) ----
export async function getFileMetadata(fileId: string): Promise<DriveFile> {
  const url = buildDriveUrl(`files/${encodeURIComponent(fileId)}`, {
    key: API_KEY,
    fields: 'id,name,mimeType,modifiedTime,size,iconLink,thumbnailLink,webViewLink,webContentLink',
  });
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`[googledrive] getFileMetadata error ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as DriveFile;
}