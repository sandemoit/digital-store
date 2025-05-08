'use client';

import { useState } from 'react';

interface ProductTabsProps {
  deskripsi: string;
  faq: string;
  komentar: string;
  ulasan: string;
}

export default function ProductTabs({ deskripsi, faq, komentar, ulasan }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'faq' | 'komentar' | 'ulasan'>('deskripsi');

  return (
    <div className="bg-white shadow rounded-md p-6">
      <div className="flex flex-wrap border-b mb-6">
        {['deskripsi', 'faq', 'komentar', 'ulasan'].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-2 mr-2 mb-2 font-semibold capitalize ${activeTab === tab
              ? 'border-b-2 border-orange-500 text-orange-500'
              : 'text-gray-500'
              }`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'deskripsi' && (
          <div className="text-gray-700 whitespace-pre-line">{deskripsi}</div>
        )}
        {activeTab === 'faq' && (
          <div className="text-gray-700 whitespace-pre-line">{faq}</div>
        )}
        {activeTab === 'komentar' && (
          <div className="text-gray-700">{komentar}</div>
        )}
        {activeTab === 'ulasan' && (
          <div className="text-gray-700">{ulasan}</div>
        )}
      </div>
    </div>
  );
}
