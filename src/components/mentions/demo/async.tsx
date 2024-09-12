import React, { useCallback, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { Mentions } from 'metis-ui';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ login: string; avatar_url: string }[]>([]);
  const ref = useRef<string>();

  const loadGithubUsers = (key: string) => {
    if (!key) {
      setUsers([]);
      return;
    }

    fetch(`https://api.github.com/search/users?q=${key}`)
      .then((res) => res.json())
      .then(({ items = [] }) => {
        if (ref.current !== key) return;

        setLoading(false);
        setUsers(items.slice(0, 10));
      });
  };

  const debounceLoadGithubUsers = useCallback(debounce(loadGithubUsers, 800), []);

  const onSearch = (search: string) => {
    console.log('Search:', search);
    ref.current = search;
    setLoading(!!search);
    setUsers([]);

    debounceLoadGithubUsers(search);
  };

  return (
    <Mentions
      className="w-full"
      loading={loading}
      onSearch={onSearch}
      options={users.map(({ login, avatar_url: avatar }) => ({
        key: login,
        value: login,
        label: (
          <div className="flex">
            <img src={avatar} alt={login} className="mr-2 h-5 w-5" />
            <span>{login}</span>
          </div>
        ),
      }))}
    />
  );
};

export default App;
