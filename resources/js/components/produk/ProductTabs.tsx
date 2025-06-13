'use client';

import { MessageCircle, MessageCircleQuestion, Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import Rating from './Rating';

interface User {
  id: number;
  name: string;
  profile_photo_path?: string;
}

interface Reply {
  id: number;
  isi: string;
  created_at: string;
  user?: User;
}

interface Komentar {
  id: number;
  isi: string;
  created_at: string;
  user?: User;
  replies?: Reply[];
  likes_count?: number;
  is_liked?: boolean;
}

interface Ulasan {
  id: number;
  isi: string;
  rating: number;
  created_at: string;
  user?: User;
  disukai?: number;
}

interface CommentFormData {
  data: {
    isi: string;
    parent_id: number | null;
  };
  setData: (key: string, value: any) => void;
  submitKomentar: (e: React.FormEvent) => void;
  processing: boolean;
  errors: any;
}

interface ProductTabsProps {
  deskripsi: string;
  faq: string;
  komentar: Komentar[];
  ulasan: Ulasan[];
  canComment?: boolean;
  isLoggedIn?: boolean;
  userId?: number;
  onReply: (komentarId: number | null) => void;
  onLike: (komentarId: number) => void;
  replyingTo: number | null;
  commentForm: CommentFormData;
}

export default function ProductTabs({
  deskripsi,
  faq,
  komentar,
  ulasan,
  canComment = false,
  isLoggedIn = false,
  userId,
  onReply,
  onLike,
  replyingTo,
  commentForm
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'faq' | 'komentar' | 'ulasan'>('deskripsi');

  return (
    <div className="bg-white shadow rounded-sm p-6">
      <div className="flex flex-wrap border-b mb-6">
        {['deskripsi', 'faq', 'komentar', 'ulasan'].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-2 mr-2 mb-2 font-semibold capitalize ${activeTab === tab
              ? 'border-b-2 border-amber-500 text-amber-500'
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
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: deskripsi }}></div>
        )}

        {activeTab === 'faq' && (
          <>
            {faq ? (
              <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: faq }}></div>
            ) : (
              <div className="text-center py-8">
                <MessageCircleQuestion className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-2 text-gray-500">Tidak ada FAQ untuk produk ini</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'komentar' && (
          <div className="text-gray-700">
            {Array.isArray(komentar) && komentar.length > 0 ? (
              <>
                {/* Daftar Komentar */}
                {komentar.map((item) => (
                  <div key={item.id} className="flex items-start mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 mr-4 overflow-hidden rounded-full bg-gray-200">
                      {item.user && item.user.profile_photo_path ? (
                        <img
                          src={item.user.profile_photo_path}
                          alt={item.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={`https://ui-avatars.com/api/?name=${item.user ? encodeURIComponent(item.user.name) : 'User'}&size=128&background=0D8ABC&color=fff`}
                          alt={item.user ? item.user.name : 'User'}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-sm">{item.user ? item.user.name : 'User'}</span>
                        <span className="mx-2 text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{item.isi}</p>

                      {/* Tombol Reply dan Like */}
                      <div className="flex items-center mt-2 space-x-4">
                        {/* Perbaikan kondisi: Admin selalu bisa berkomentar */}
                        {canComment && (
                          <button
                            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                            onClick={() => onReply(item.id)}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Balas
                          </button>
                        )}
                        <button
                          className={`text-xs ${item.is_liked ? 'text-amber-500' : 'text-gray-500 hover:text-gray-700'} flex items-center`}
                          onClick={() => onLike(item.id)}
                        >
                          <ThumbsUp className={`w-4 h-4 mr-1 ${item.is_liked ? 'fill-amber-500' : ''}`} />
                          Suka ({item.likes_count || 0})
                        </button>
                      </div>

                      {/* Reply form if replying to this comment */}
                      {replyingTo === item.id && (
                        <div id={`reply-form-${item.id}`} className="mt-4 ml-4">
                          <div className="flex items-start">
                            <div className="w-8 h-8 mr-2 overflow-hidden rounded-full bg-gray-200">
                              <img
                                src="https://ui-avatars.com/api/?name=User&size=64&background=f54d21&color=fff"
                                alt="Your Avatar"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <form onSubmit={commentForm.submitKomentar}>
                                <textarea
                                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                                  placeholder="Tulis balasan Anda di sini..."
                                  rows={2}
                                  value={commentForm.data.isi}
                                  onChange={(e) => commentForm.setData('isi', e.target.value)}
                                  required
                                ></textarea>
                                {commentForm.errors.isi && <div className="text-red-500 text-xs mt-1">{commentForm.errors.isi}</div>}
                                <div className="mt-2 flex justify-end space-x-2">
                                  <button
                                    type="button"
                                    className="px-3 py-1 border border-gray-300 text-gray-600 rounded-sm text-xs hover:bg-gray-100 focus:outline-none"
                                    onClick={() => onReply(null)}
                                  >
                                    Batal
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-3 py-1 bg-amber-500 text-white rounded-sm text-xs hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                    disabled={commentForm.processing}
                                  >
                                    {commentForm.processing ? 'Mengirim...' : 'Kirim Balasan'}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sub-komentar/Balasan (jika ada) */}
                      {item.replies && item.replies.length > 0 && (
                        <div className="mt-3 ml-4 pl-4 border-l-2 border-gray-100 space-y-4">
                          {item.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start">
                              <div className="w-8 h-8 mr-2 overflow-hidden rounded-full bg-gray-200">
                                {reply.user && reply.user.profile_photo_path ? (
                                  <img
                                    src={reply.user.profile_photo_path}
                                    alt={reply.user.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${reply.user ? encodeURIComponent(reply.user.name) : 'User'}&size=64&background=f54d21&color=fff`}
                                    alt={reply.user ? reply.user.name : 'User'}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="font-medium text-xs">{reply.user ? reply.user.name : 'User'}</span>
                                  <span className="mx-2 text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.created_at).toLocaleDateString('id-ID', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <p className="text-xs">{reply.isi}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Form Komentar Baru */}
                {isLoggedIn && canComment && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Tinggalkan Komentar</h4>
                    <div className="flex items-start">
                      <div className="w-10 h-10 mr-3 overflow-hidden rounded-full bg-gray-200">
                        <img
                          src="https://ui-avatars.com/api/?name=User&size=128&background=0D8ABC&color=fff"
                          alt="Your Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <form onSubmit={commentForm.submitKomentar}>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                            placeholder="Tulis komentar Anda di sini..."
                            rows={3}
                            value={commentForm.data.isi}
                            onChange={(e) => commentForm.setData('isi', e.target.value)}
                            required
                          ></textarea>
                          {commentForm.errors.isi && <div className="text-red-500 text-xs mt-1">{commentForm.errors.isi}</div>}
                          <div className="mt-2 flex justify-end">
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-amber-500 text-white rounded-sm text-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                              disabled={commentForm.processing}
                            >
                              {commentForm.processing ? 'Mengirim...' : 'Kirim Komentar'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Tampilan jika tidak ada komentar */}
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2 text-gray-500">Belum ada komentar untuk produk ini</p>

                  {/* Form Komentar Pertama */}
                  {canComment && (
                    <div className="mt-6 max-w-xl mx-auto">
                      <h4 className="text-sm font-medium mb-3 text-left">Jadilah yang pertama berkomentar</h4>
                      <div className="flex items-start">
                        <div className="w-10 h-10 mr-3 overflow-hidden rounded-full bg-gray-200">
                          <img
                            src="https://ui-avatars.com/api/?name=User&size=128&background=0D8ABC&color=fff"
                            alt="Your Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <form onSubmit={commentForm.submitKomentar}>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                              placeholder="Tulis komentar Anda di sini..."
                              rows={3}
                              value={commentForm.data.isi}
                              onChange={(e) => commentForm.setData('isi', e.target.value)}
                              required
                            ></textarea>
                            {commentForm.errors.isi && <div className="text-red-500 text-xs mt-1">{commentForm.errors.isi}</div>}
                            <div className="mt-2 flex justify-end">
                              <button
                                type="submit"
                                className="px-4 py-1.5 bg-amber-500 text-white rounded-sm text-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                disabled={commentForm.processing}
                              >
                                {commentForm.processing ? 'Mengirim...' : 'Kirim Komentar'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'ulasan' && (
          <div className="text-gray-700">
            {Array.isArray(ulasan) && ulasan.length > 0 ? (
              ulasan.map((item) => (
                <div key={item.id} className="flex items-start mb-4 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 mr-4 overflow-hidden rounded-full bg-gray-200">
                    {/* Jika ada user dengan foto profil, tampilkan foto usernya */}
                    {item.user && item.user.profile_photo_path ? (
                      <img
                        src={item.user.profile_photo_path}
                        alt={item.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`https://ui-avatars.com/api/?name=${item.user ? encodeURIComponent(item.user.name) : 'User'}&size=256&background=0D8ABC&color=fff`}
                        alt={item.user ? item.user.name : 'User'}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center text-sm">
                        <div className="font-medium mr-2">
                          {item.user ? item.user.name : 'User'}
                        </div>
                        <Rating value={item.rating || 0} />
                        <span className="ml-2">{item.rating || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-4">
                          {new Date(item.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <button className="flex items-center text-sm">
                          <ThumbsUp className='w-5 h-5 text-amber-500 hover:text-amber-500' />
                          <span className="ml-1 text-xs">{item.disukai || 0}</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{item.isi}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center py-8">
                <Star className="h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">Belum ada ulasan untuk produk ini</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
}
