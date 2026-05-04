// hooks/useFetch.js
// Üldkasutatav hook API päringute jaoks

import { useState, useEffect, useRef } from 'react';

/**
 * @param {Function} fetchFn - async funktsioon, mis tagastab andmed
 * @param {Array} deps - sõltuvuste massiiv (nagu useEffect-is)
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    // Tühista eelmine päring
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message || 'Midagi läks valesti');
          setLoading(false);
        }
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
