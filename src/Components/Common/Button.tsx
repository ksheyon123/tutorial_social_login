"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

// 버튼 크기 타입 정의
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

// 버튼 스타일 타입 정의
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "danger";

// 버튼 속성 인터페이스 정의
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  name?: string; // 기존 코드와의 호환성을 위해 추가
}

/**
 * 범용적으로 사용할 수 있는 Button 컴포넌트
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  name,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) => {
  // CSS 클래스 조합
  const buttonClasses = [
    styles.button,
    styles[size],
    styles[variant],
    disabled || loading ? styles.disabled : "",
    loading ? styles.loading : "",
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      name={name}
      {...rest}
    >
      {loading ? (
        <>
          <svg
            className={styles.spinner}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>{children || name}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
          <span>{children || name}</span>
          {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
