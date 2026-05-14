import { useState, useCallback } from 'react';

/**
 * Custom hook to manage state history (Undo/Redo)
 * @param initialState Initial state value
 */
export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture([state, ...future]);
    setState(previous);
  }, [canUndo, past, state, future]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, state]);
    setFuture(newFuture);
    setState(next);
  }, [canRedo, future, past, state]);

  const set = useCallback((newValues: T) => {
    // Only push to history if data actually changed to avoid redundant steps
    if (JSON.stringify(newValues) === JSON.stringify(state)) return;

    setPast([...past, state]);
    setFuture([]);
    setState(newValues);
  }, [past, state]);

  const reset = useCallback((newInitialState: T) => {
    setState(newInitialState);
    setPast([]);
    setFuture([]);
  }, []);

  return { state, set, undo, redo, reset, canUndo, canRedo };
}
