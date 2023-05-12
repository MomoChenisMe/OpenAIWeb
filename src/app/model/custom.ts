import { ToForm } from "./reactiveform";

export interface QAModel {
  question: string;
}

export interface QAFormModel extends ToForm<QAModel> { }

export interface ChatGPTCusModel {
  role: string;
  content: string;
  time: Date;
}

export interface ChatGPTModel {
  role: string;
  content: string;
}

export interface ChatGPTCusFormModel extends ToForm<ChatGPTCusModel> { }
export interface ChatGPTFormModel extends ToForm<ChatGPTModel> { }

export interface EmbeddingModel {
  text: string;
}

export interface EmbeddingFormModel extends ToForm<EmbeddingModel> { }

export interface HotKeyButtonModel {
  name: string;
  icon?: string;
  color?: string;
  hoverColor?: string;
  hotKey: string;
}

export  interface ChatRoomModal {
  chatName: string;
  chatroomID: string;
  content: ChatGPTModel[];
}

export interface ChatroomNameModel {
  chatName: string;
}

export interface ChatroomNameFormModel extends ToForm<ChatroomNameModel> { }

export interface TextModal {
  id: string;
  name: string;
  folderId: string;
}

export type NodeType = 'root' | 'folder' | 'text';

export interface ViewNodeModal {
  id: string;
  name: string;
  parentId: string | null;
  nodeType: NodeType;
  children: ViewNodeModal[];
}

export interface CreateFolderModal {
  name: string;
  parentId: string | null;
}

export interface CreateFolderFormModel extends ToForm<CreateFolderModal> { }

export type PopovermenuType = 'root' | 'folder' | 'text';

export interface PopovermenuModal {
  id: string | null;
  position?: { x: number, y: number };
  menuType?: PopovermenuType;
}

export interface RenameModal {
  id: string;
  newName: string;
}

export interface RenameFormModel extends ToForm<RenameModal> { }

export interface DeleteFolderModal {
  id: string;
  name: string;
}

export interface CreateTextModal {
  name: string;
  folderId: string | null;
  textContent: string;
  textHtml: string;
}

export interface CreateTextFormModel extends ToForm<CreateTextModal> { }

export interface DeleteTextModal {
  id: string;
  name: string;
}

export interface StorageTextModal {
  id: string;
  name: string;
}

export interface OpenTextModal {
  id: string;
  name: string;
  folderId: string;
  textContent: string;
  textHtml: string;
}

export interface EditTextModal {
  id: string;
  textHtml: string;
}

export interface EditTextFormModel extends ToForm<EditTextModal> { }

export interface UsingTextModal {
  textGuid: string;
  textName: string;
}
