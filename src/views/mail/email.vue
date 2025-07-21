<template>
  <div class="mail-container">
    <div class="mail-sidebar">
      <div class="sidebar-actions">
        <el-button type="primary" @click="handleComposeMail">写邮件</el-button>
        <el-button type="success" @click="syncMailWithLoading">收邮件</el-button>
      </div>
      <el-menu default-active="inbox" :default-openeds="defaultOpeneds" @select="handleFolderSelect">
        <el-sub-menu index="common">
          <template #title>
            <el-icon><folder /></el-icon>
            <span>常用文件夹</span>
          </template>
          <el-menu-item index="inbox">收件箱</el-menu-item>
          <el-menu-item index="sent">已发送</el-menu-item>
          <el-menu-item index="draft">草稿箱</el-menu-item>
          <el-menu-item index="trash">回收站</el-menu-item>
        </el-sub-menu>
        <el-sub-menu :index="mailAccount">
          <template #title>
            <el-icon><User /></el-icon>
            <span>{{ mailAccount }}</span>
          </template>
          <el-menu-item index="important">重要邮件</el-menu-item>
          <el-menu-item index="starred">已加星标</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <div class="mail-content">
      <div class="mail-header">
        <div class="header-left">
          <el-input v-model="search" placeholder="搜索邮件" prefix-icon="search" clearable />
        </div>
      </div>

      <div class="mail-list">
        <!-- 修改表格，添加行点击事件 -->
        <el-table :data="mails" style="width: 100%" @row-click="handleRowClick" :row-style="getRowStyle">
          <el-table-column prop="fromAddress" label="发件人" width="250">
            <template #default="{ row }">
              <el-tooltip placement="top" :show-after="1000">
                <template #content>
                  <div style="display: flex; flex-direction: column; gap: 8px">
                    <div style="cursor: pointer" @click="addCustomer(row)">
                      <el-icon><CirclePlus /></el-icon>
                      <span style="margin-left: 4px">增加客户</span>
                    </div>
                    <div style="cursor: pointer" @click="addLead(row)">
                      <el-icon><Connection /></el-icon>
                      <span style="margin-left: 4px">增加线索</span>
                    </div>
                  </div>
                </template>
                <div style="display: flex; align-items: center" :style="{ fontWeight: row.isRead === 0 ? 'bold' : 'normal' }">
                  <el-icon><User /></el-icon>
                  <span style="margin-left: 8px">{{ row.fromAddress }}</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="subject" label="主题">
            <template #default="{ row }">
              <span :style="{ fontWeight: row.isRead === 0 ? 'bold' : 'normal' }">{{ row.subject }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="receivedDate" label="时间" width="180">
            <template #default="{ row }">
              <span :style="{ fontWeight: row.isRead === 0 ? 'bold' : 'normal' }">{{ formatDate(row.receivedDate) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total" @current-change="handlePageChange" />
        </div>
      </div>
      <!-- 在 mail-list div 后添加 -->
      <el-drawer
        v-model="drawerVisible"
        title="邮件内容"
        size="70%"
        :destroy-on-close="true"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
      >
        <template v-if="selectedMail">
          <div class="mail-detail">
            <div class="mail-info">
              <div class="info-item">
                <span class="label">发件人：</span>
                <span>{{ selectedMail.fromAddress }}</span>
              </div>
              <div class="info-item">
                <span class="label">收件人：</span>
                <span>{{ selectedMail.toAddresses }}</span>
              </div>
              <div class="info-item">
                <span class="label">抄送：</span>
                <span>{{ selectedMail.ccAddresses }}</span>
              </div>
              <div class="info-item">
                <span class="label">密送：</span>
                <span>{{ selectedMail.bccAddresses }}</span>
              </div>
              <div class="info-item">
                <span class="label">主题：</span>
                <span>{{ selectedMail.subject }}</span>
              </div>
              <div class="info-item">
                <span class="label">时间：</span>
                <span>{{ formatDate(selectedMail.receivedDate) }}</span>
              </div>
            </div>
            <el-divider />
            <div class="mail-content-body">
              <div v-html="selectedMail.bodyText"></div>
            </div>
          </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { syncMailApi, queryMailApi, getUserMailAccount } from '@/api/mail/email';
import type { MailDetailVO } from '@/api/mail/types';
import { Folder, User, CirclePlus, Connection } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 邮件列表数据
const mails = ref<MailDetailVO[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(20);
const search = ref<string>('');

// 邮箱状态
const mailAccount = ref<string>('');
const defaultOpeneds = ref<string[]>(['common']);

// 抽屉相关状态
const drawerVisible = ref(false);
const selectedMail = ref<MailDetailVO | null>(null);

// 处理行点击事件
const handleRowClick = (row: MailDetailVO) => {
  selectedMail.value = row;
  drawerVisible.value = true;
};

// 添加行样式处理函数
const getRowStyle = (row: MailDetailVO) => {
  return {
    cursor: 'pointer',
    fontWeight: row.isRead === 0 ? 'bold' : 'normal'
  };
};

// 添加处理方法
const addCustomer = (row: MailDetailVO) => {
  // 处理添加客户的逻辑
  ElMessage.success('添加客户功能待实现');
};

const addLead = (row: MailDetailVO) => {
  // 处理添加线索的逻辑
  ElMessage.success('添加线索功能待实现');
};

// 获取用户邮箱账号信息
const initMailAccount = async () => {
  try {
    const res = await getUserMailAccount();
    if (res.code === 200 && res.data) {
      mailAccount.value = res.data.email;
      defaultOpeneds.value = ['common', mailAccount.value];
      return true;
    }
    return false;
  } catch (error) {
    ElMessage.error('网络异常或服务错误！');
    return false;
  }
};

// 同步邮件
const syncMailWithLoading = async () => {
  const loading = ElLoading.service({ text: '正在同步邮件，请稍候...' });
  try {
    const res = await syncMailApi({ syncCount: 500 });
    if (res.code === 200) {
      ElMessage.success(`同步完成，已拉取邮件！`);
      await fetchLocalMails(1);
    } else {
      ElMessage.error(res.msg || '同步失败！');
    }
  } catch (error) {
    ElMessage.error('网络异常或服务错误！');
  } finally {
    loading.close();
  }
};

// 查询本地邮件
const currentFolder = ref<string>('inbox');
const fetchLocalMails = async (page = 1) => {
  try {
    const res = await queryMailApi({
      pageNum: page,
      pageSize: pageSize.value,
      keyword: search.value,
      folder: currentFolder.value
    });
    if (res.code === 200) {
      mails.value = res.rows || []; // 直接使用 res.rows
      total.value = res.total || 0; // 直接使用 res.total
      currentPage.value = page;
    } else {
      ElMessage.error(res.msg || '本地邮件查询失败！');
    }
  } catch (error) {
    ElMessage.error('网络异常或服务错误！');
  }
};

// 写邮件
const handleComposeMail = () => {
  router.push('/mail/compose');
};

// 事件处理
const handlePageChange = (page: number) => {
  fetchLocalMails(page);
};

const handleFolderSelect = (name: string) => {
  currentFolder.value = name;
  fetchLocalMails(1);
};

// 格式化日期
const formatDate = (val: string | Date): string => {
  if (!val) return '';
  const d = typeof val === 'string' ? new Date(val) : val;
  return d.toLocaleString('zh-CN', { hour12: false });
};

// 监听搜索
watch(search, () => {
  fetchLocalMails(1);
});

// 初始化
onMounted(async () => {
  const hasAccount = await initMailAccount();
  if (hasAccount) {
    await fetchLocalMails(1);
  }
});
</script>

<style lang="scss" scoped>
.mail-container {
  display: flex;
  height: 100%;
  background-color: #fff;

  .mail-sidebar {
    width: 280px;
    border-right: 1px solid #dcdfe6;
    display: flex;
    flex-direction: column;

    .sidebar-actions {
      padding: 16px;
      display: flex;
      gap: 12px; // 调整按钮之间的间距
      flex-direction: row; // 改为水平排列
      flex-wrap: nowrap; // 防止按钮换行
      justify-content: space-between; // 两端对齐

      .el-button {
        flex: 1; // 按钮等宽
        min-width: 0; // 防止按钮溢出
      }
    }
  }

  .mail-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .mail-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;

      .header-left {
        width: 300px;
      }
    }

    .mail-list {
      flex: 1;
      overflow: auto;
      padding: 16px;

      .pagination {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .el-icon {
    font-size: 18px;
    color: #0db1ed;
  }
}
</style>
