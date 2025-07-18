/* eslint-disable prettier/prettier */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MailDetailVO, UserMailAccountVO } from './types';

// 查询邮件列表
export function queryMailApi(params: {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  folder: string;
}): AxiosPromise<MailDetailVO[]> {
  return request({
    url: '/mail/mailMessage/list',
    method: 'get',
    params
  });
}

// 同步邮件
export const syncMailApi = (): AxiosPromise => {
  return request({
    url: '/mail/mailMessage/sync',
    method: 'post'
  });
};

// src/api/types/common.ts
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}
// src/api/mail/email.ts
export function getUserMailAccount(): Promise<ApiResponse<UserMailAccountVO>> {
  return request({
    url: '/mail/mailMessage/accountInfo',
    method: 'get'
  });
}
