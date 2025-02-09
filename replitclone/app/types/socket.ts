import { FileData } from '../types/file';

export interface ServerToClientEvents {
"new-file": (file: FileData) => void;
"delete-file": (fileId: string) => void;
"file-update": (data: { fileId: string; content: string }) => void;
}

export interface ClientToServerEvents {
"new-file": (file: FileData) => void;
"delete-file": (fileId: string) => void;
"file-update": (data: { fileId: string; content: string }) => void;
}
