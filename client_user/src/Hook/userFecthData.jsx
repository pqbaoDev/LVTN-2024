import { useState, useEffect, useCallback } from "react";

const useFetchData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Define the fetch function with useCallback to avoid recreating it every render
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.message || 'Có lỗi xảy ra');
            }

            const result = await res.json();
            setData(result.data);
            setError(null);
        } catch (error) {
            setError(error.message || 'Lỗi không xác định');
        } finally {
            setLoading(false);
        }
    }, [url]);

    // Fetch data when the component mounts or when the url changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);  // fetchData is the dependency

    return { data, loading, error, refetch: fetchData };
};

export default useFetchData;
