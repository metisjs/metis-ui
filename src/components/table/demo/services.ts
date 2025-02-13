export interface DataType {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  login: {
    uuid: string;
  };
}

export let dataSource: DataType[] = [];

const initDataSource = async () => {
  dataSource = (await fetch(`https://randomuser.me/api?page=1&results=200`)
    .then((res) => res.json())
    .then(({ results }) => results)) as DataType[];
};

export async function fetchDataWithPagination(params: {
  filters: { gender?: string[] };
  sorter: { field?: 'name'; order?: 'descend' | 'ascend' };
  current: number;
  pageSize: number;
}): Promise<{ data: DataType[]; total: number }> {
  if (dataSource.length === 0) {
    await initDataSource();
  }

  console.log('fetchDataWithPagination', params);
  const { current, pageSize } = params;
  let d = dataSource.filter((record) =>
    params.filters.gender ? params.filters.gender.includes(record.gender) : true,
  );

  d.sort((a, b) => {
    if (params.sorter.field) {
      if (params.sorter.order === 'descend') {
        return `${a.name.first}${a.name.last}` > `${b.name.first}${b.name.last}` ? -1 : 1;
      }
      return `${a.name.first}${a.name.last}` <= `${b.name.first}${b.name.last}` ? -1 : 1;
    }
    return 0;
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: d.slice((current - 1) * pageSize, current * pageSize),
        total: d.length,
      });
    }, 700);
  });
}

export async function fetchData(): Promise<{ data: DataType[] }> {
  if (dataSource.length === 0) {
    await initDataSource();
  }

  console.log('fetchData');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: dataSource.slice(0, 30),
      });
    }, 700);
  });
}
