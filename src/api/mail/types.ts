// 邮件详情类型
export interface MailDetailVO {
  id: string;
  fromAddress: string;
  toAddress: string;
  subject: string;
  receivedDate: string;
  bodyText: string;
  // 其他邮件相关字段
}

// 邮箱账号信息类型
export interface UserMailAccountVO {
  id: string;
  email: string;
}
