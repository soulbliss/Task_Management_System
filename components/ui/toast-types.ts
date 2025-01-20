import * as React from "react"
import { Toast, ToastAction } from "./toast"

export interface ToastProps extends React.ComponentPropsWithoutRef<typeof Toast> {
  variant?: "default" | "destructive";
}

export type ToastActionElement = React.ReactElement<typeof ToastAction> 