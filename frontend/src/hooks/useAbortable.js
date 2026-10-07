import { useCallback, useEffect, useRef } from "react";

// Runs async loader work under an AbortController, aborting the previous run
// first. Pass the provided signal through to the api modules.
//
// Callers must ignore AbortError (client.js rethrows it unwrapped, never as
// ApiError) and must not touch error/loading state for aborted runs.
export function useAbortable() {
  const controllerRef = useRef(null);

  useEffect(() => {
    const ref = controllerRef;
    return () => ref.current?.abort();
  }, []);

  return useCallback((fn) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    return fn(controller.signal);
  }, []);
}
