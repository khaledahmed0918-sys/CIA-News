/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Streamers } from '@/pages/Streamers';
import { Cases } from '@/pages/Cases';
import { Wanted } from '@/pages/Wanted';
import { General } from '@/pages/General';
import { Characters } from '@/pages/Characters';
import { Analytics } from '@/pages/Analytics';
import { StreamerProvider } from '@/context/StreamerContext';

function AppContent() {
  const location = useLocation();
  
  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/streamers" element={<Streamers />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/wanted" element={<Wanted />} />
      <Route path="/general" element={<General />} />
      <Route path="/characters" element={<Characters />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

export default function App() {
  return (
    <StreamerProvider>
      <Router>
        <Layout>
          <AppContent />
        </Layout>
      </Router>
    </StreamerProvider>
  );
}

