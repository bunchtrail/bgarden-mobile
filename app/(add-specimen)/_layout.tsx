import { Stack } from 'expo-router';
import React from 'react';

export default function AddSpecimenLayout() {
  // This layout can be simple, just rendering the stack.
  // No specific screen options needed here unless you want a group header.
  return <Stack screenOptions={{ headerShown: false }} />;
} 