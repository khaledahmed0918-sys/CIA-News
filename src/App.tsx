/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Analytics } from '@/pages/Analytics';
import { Streamers } from '@/pages/Streamers';
import { Cases } from '@/pages/Cases';
import { Wanted } from '@/pages/Wanted';
import { General } from '@/pages/General';
import { Characters } from '@/pages/Characters';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/streamers" element={<Streamers />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/wanted" element={<Wanted />} />
          <Route path="/general" element={<General />} />
          <Route path="/characters" element={<Characters />} />
        </Routes>
      </Layout>
    </Router>
  );
}

