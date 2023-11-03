interface QuickLinkData {
  [key: string]: {
    [key: string]: QuickLinkDataItem
  }
}

interface QuickLinkDataItem {
  id: string;
  _id?: string;
  title: string;
  img: string;
  factory: string;
  createTime: string;
  banner: string;
  about: string;
  startLink: string;
  src: string;
  tags: string[];
  title_cn: string;
  collect: number,
  custom_col?: string[]
}

interface tbNameItem {
  id?: number;
  name: string;
  value: string;
}

declare namespace ResponseParam {
  interface status {
    code: number;
    message?: string;
  }
  
  interface getQuickLinkData {
    status: status,
    result: QuickLinkDataItem[],
  }
}

interface collectListParam {
  id: string | number;
  name: string;
  value: string;
}