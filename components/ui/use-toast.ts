'use client'

// Inspired by react-hot-toast library
import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast-types"

interface Toast extends ToastProps {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
}

const TOAST_LIMIT = 1

type State = {
  toasts: Toast[]
}

export function useToast() {
  const [state, setState] = React.useState<State>({
    toasts: [],
  })

  const toast = React.useCallback(
    ({ ...props }: Omit<Toast, "id">) => {
      setState((state) => {
        if (state.toasts.length >= TOAST_LIMIT) {
          return state
        }

        return {
          ...state,
          toasts: [
            ...state.toasts,
            { id: Math.random().toString(), ...props },
          ],
        }
      })
    },
    []
  )

  const dismiss = React.useCallback((toastId?: string) => {
    setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== toastId),
    }))
  }, [])

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  }
} 