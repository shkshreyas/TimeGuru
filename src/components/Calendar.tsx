import React from 'react';
import { motion } from 'framer-motion';

export default function Calendar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      {/* Calendar content will be implemented in the next step */}
    </motion.div>
  );
}