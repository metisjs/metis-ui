/* eslint-disable no-template-curly-in-string */
import type { Locale } from '.';
import Calendar from '../calendar/locale/zh_CN';
import DatePicker from '../date-picker/locale/zh_CN';

const typeTemplate = '${label}不是一个有效的${type}';

const localeValues: Locale = {
  locale: 'zh-cn',
  Pagination: {
    // Options
    items_per_page: '条/页',
    jump_to: '跳至',
    page: '页',

    // Pagination
    prev_page: '上一页',
    next_page: '下一页',
    prev_5: '向前 5 页',
    next_5: '向后 5 页',
    prev_3: '向前 3 页',
    next_3: '向后 3 页',
    page_size: '页码',
  },
  DatePicker,
  Calendar,
  // locales for all components
  global: {
    inputPlaceholder: '请输入',
    selectPlaceholder: '请选择',
    moneySymbol: '¥',
  },
  Table: {
    emptyText: 'No data',
    filter: {
      confirm: '确定',
      reset: '重置',
      emptyText: '无筛选项',
      checkall: '全选',
      searchPlaceholder: '在筛选项中搜索',
    },
    selection: {
      selectAll: '全选所有',
      selectInvert: '反选当页',
      selectNone: '清空所有',
    },
    expand: '展开行',
    collapse: '关闭行',
    sort: {
      triggerDesc: '点击降序',
      triggerAsc: '点击升序',
      cancel: '取消排序',
    },
    editable: {
      saveText: '保存',
      cancelText: '取消',
      editingAlertMessage: '只能同时编辑一行',
    },
    toolbar: {
      reload: '刷新',
      setting: '列设置',
      fullscreen: '全屏',
      exitFullscreen: '退出全屏',
      reset: '重置',
      leftPin: '固定在列首',
      noPin: '不固定',
      rightPin: '固定在列尾',
    },
    search: {
      search: '查询',
      reset: '重置',
      collapsed: '展开',
      expand: '收起',
    },
  },
  Modal: {
    okText: '确定',
    cancelText: '取消',
    justOkText: '知道了',
  },
  Tour: {
    Next: '下一步',
    Previous: '上一步',
    Finish: '结束导览',
  },
  Popconfirm: {
    cancelText: '取消',
    okText: '确定',
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: '请输入搜索内容',
    itemUnit: '项',
    itemsUnit: '项',
    remove: '删除',
    selectCurrent: '全选当页',
    removeCurrent: '删除当页',
    selectAll: '全选所有',
    removeAll: '删除全部',
    selectInvert: '反选当页',
  },
  Upload: {
    uploading: '文件上传中',
    removeFile: '删除文件',
    uploadError: '上传错误',
    previewFile: '预览文件',
    downloadFile: '下载文件',
  },
  Empty: {
    description: '暂无数据',
  },
  Form: {
    optional: '（可选）',
    defaultValidateMessages: {
      default: '字段验证错误${label}',
      required: '请输入${label}',
      enum: '${label}必须是其中一个[${enum}]',
      whitespace: '${label}不能为空字符',
      date: {
        format: '${label}日期格式无效',
        parse: '${label}不能转换为日期',
        invalid: '${label}是一个无效日期',
      },
      types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate,
      },
      string: {
        len: '${label}须为${len}个字符',
        min: '${label}最少${min}个字符',
        max: '${label}最多${max}个字符',
        range: '${label}须在${min}-${max}字符之间',
      },
      number: {
        len: '${label}必须等于${len}',
        min: '${label}最小值为${min}',
        max: '${label}最大值为${max}',
        range: '${label}须在${min}-${max}之间',
      },
      array: {
        len: '须为${len}个${label}',
        min: '最少${min}个${label}',
        max: '最多${max}个${label}',
        range: '${label}数量须在${min}-${max}之间',
      },
      pattern: {
        mismatch: '${label}与模式不匹配${pattern}',
      },
    },
  },
  Image: {
    preview: '预览',
  },
  QRCode: {
    expired: '二维码过期',
    refresh: '点击刷新',
    scanned: '已扫描',
  },
  ColorPicker: {
    transparent: '无色',
    singleColor: '单色',
    gradientColor: '渐变色',
  },
  Statistic: {
    collapse: '收起',
    all: '全部',
  },
  Switch: {
    open: '打开',
    close: '关闭',
  },
};

export default localeValues;
