export interface DataItem {
  id: number;
  name: string;
  createdAt: number;
}

export const dataSource: DataItem[] = [];

for (let i = 0; i < 300; i += 1) {
  dataSource.push({
    id: i,
    name: `TradeCode ${i}`,
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
  });
}

export async function fetchDataWithPagination(params: {
  [key: string]: any;
  current: number;
  pageSize: number;
}): Promise<{ data: DataItem[]; total: number }> {
  const { current, pageSize } = params;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: dataSource.slice((current - 1) * pageSize, current * pageSize),
        total: dataSource.length,
      });
    }, 700);
  });
}

export async function fetchData(params?: {
  filters?: { name?: string };
}): Promise<{ data: DataItem[] }> {
  console.log('fetchData', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: dataSource
          .slice(0, 30)
          .filter((item) =>
            params?.filters?.name ? item.name.includes(params?.filters?.name) : true,
          ),
      });
    }, 700);
  });
}
