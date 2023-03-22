interface QuickLinkData {
  [key: string]: {
    [key: string]: QuickLinkDataItem
  }
}

interface QuickLinkDataItem {
  id: string;
  title: string;
  img: string;
  factory: string;
  createTime: number;
  banner: string;
  about: string;
  startLink: string;
}

declare namespace ResponseParam {
  interface status {
    code: number;
    message?: string;
  }
  
  interface getQuickLinkData {
    status: status,
    result: QuickLinkData,
  }
}

