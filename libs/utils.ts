"use client";
import { ClipboardEvent, KeyboardEvent } from "react";
import { formatUnits, isAddress } from "viem";
import { AddressString } from "./chains";

export const getAuthToken = () => {
  return window.localStorage.getItem("authToken");
};

export const blockInvalidChar = (e: KeyboardEvent<HTMLInputElement>) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

export const countDecimals = (val: number) => {
  if (Math.floor(val) === val) return 0;
  return val.toString().split(".")[1].length || 0;
};

export const disablePaste = (e: ClipboardEvent<HTMLInputElement>) => {
  const value = Number(e.clipboardData.getData("text"));
  if (value < 0) e.preventDefault();
};

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const getNumber = (val: bigint, decimal: number): number => {
  try {
    // Ensure val is a string and format with the given decimals
    const formattedValue = formatUnits(val, decimal);

    // Convert formatted string to number
    return parseFloat(formattedValue);
  } catch (error) {
    console.error('Error formatting or converting value:', error);
    // throw new Error('Invalid input or formatting error');
    return 0
  }
};

export const smallAddress = (address: string) => {
  return `${address?.substring(0, 4)}...${address?.substring(
    address?.length - 4,
    address?.length
  )}`;
};

export const formatArray = (array: any[]) => {
  return JSON.parse(JSON.stringify(array));
};

export const isValidAddress = (address: AddressString): boolean => {
  // Check if the address is a valid Ethereum address
  if (!isAddress(address)) {
    return false;
  }

  // Check if the address is the zero address
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  return address.toLowerCase() !== zeroAddress;
};
