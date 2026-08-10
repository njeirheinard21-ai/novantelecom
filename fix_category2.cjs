const fs = require('fs');

let catCode = fs.readFileSync('src/pages/Category.tsx', 'utf8');

catCode = catCode.replace(/const \{ data, isLoading \} = useProducts\(\{ categoryId: id, search: debouncedSearchTerm \}\);\n  const products = data\?\.items \|\| \[\];/,
  `const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, isLoading } = useProducts({ categoryId: id, search: debouncedSearchTerm });
  const products = data?.items || [];
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchParams.set('q', debouncedSearchTerm);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams, { replace: true });
  }, [debouncedSearchTerm, setSearchParams, searchParams]);`
);

fs.writeFileSync('src/pages/Category.tsx', catCode);
