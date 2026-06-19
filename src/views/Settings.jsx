"use client";
import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';

export default function Settings() {
  // Password Form States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  // System Reset States
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdError("Semua kolom kata sandi wajib diisi.");
      return;
    }

    if (newPassword.length < 6) {
      setPwdError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setPwdLoading(true);
    try {
      await api.changePassword(oldPassword, newPassword);
      setPwdSuccess("Kata sandi berhasil diubah.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwdError(err.message || "Gagal mengubah kata sandi.");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleResetConfirm = async () => {
    setIsResetConfirmOpen(false);
    setResetError("");
    setResetLoading(true);

    try {
      await api.resetAllSystemData();
      
      // Clear wizard dismissal state to trigger SetupWizard on next mount
      localStorage.removeItem('hl_wizard_dismissed');
      
      // Redirect to dashboard and reload window to clean states
      window.location.href = '/dashboard';
    } catch (err) {
      setResetError(err.message || "Gagal mereset data sistem.");
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-150/40 shadow-sm">
        <h1 className="text-hero text-xl">Pengaturan Sistem</h1>
        <p className="text-gray-500 text-xs mt-1">Ubah keamanan akun Anda atau reset ulang seluruh database sistem.</p>
      </div>

      {/* Main Grid Layout */}
      <div className="space-y-6">
        
        {/* Section 1: Change Password Card */}
        <div className="bg-[#FAF7F0] border-4 border-[#E8DCC8] rounded-3xl p-6 md:p-8 max-w-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#3D1A0F] text-white border border-[#4E271B] rounded-xl flex items-center justify-center">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#3D1A0F] font-heading">Ubah Kata Sandi Akun</h2>
              <p className="text-xs text-[#6B4F3A] font-semibold">Gunakan formulir di bawah ini untuk mengubah kata sandi masuk aplikasi Anda.</p>
            </div>
          </div>

          {pwdError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl text-xs font-bold flex items-start gap-2 mb-4 animate-shake">
              <ShieldAlert className="flex-shrink-0" size={16} />
              <span>{pwdError}</span>
            </div>
          )}

          {pwdSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-start gap-2 mb-4">
              <CheckCircle2 className="flex-shrink-0" size={16} />
              <span>{pwdSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Input: Old Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#6B4F3A] uppercase tracking-wider">Kata Sandi Lama</label>
              <div className="relative">
                <input 
                  type={showOld ? "text" : "password"} 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full h-12 bg-white border border-[#E8DCC8] rounded-xl pl-4 pr-12 text-sm focus:border-[#C97B1A] outline-none transition-all font-semibold text-[#1C1009]"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Input: New Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#6B4F3A] uppercase tracking-wider">Kata Sandi Baru (Min 6 Huruf)</label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru"
                  className="w-full h-12 bg-white border border-[#E8DCC8] rounded-xl pl-4 pr-12 text-sm focus:border-[#C97B1A] outline-none transition-all font-semibold text-[#1C1009]"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Input: Confirm New Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#6B4F3A] uppercase tracking-wider">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru"
                  className="w-full h-12 bg-white border border-[#E8DCC8] rounded-xl pl-4 pr-12 text-sm focus:border-[#C97B1A] outline-none transition-all font-semibold text-[#1C1009]"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button 
              type="submit"
              disabled={pwdLoading}
              className="w-full bg-[#C97B1A] hover:bg-[#A85F10] disabled:bg-gray-300 text-white font-extrabold h-12 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {pwdLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Menyimpan...
                </>
              ) : (
                "Simpan Kata Sandi Baru"
              )}
            </button>
          </form>
        </div>

        {/* Section 2: Reset Data Card */}
        <div className="bg-rose-50/50 border-4 border-rose-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle size={22} className="flex-shrink-0" />
              <h2 className="text-base font-extrabold uppercase font-heading">Pengaturan Awal &amp; Reset Ulang Data</h2>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed font-semibold">
              Gunakan tombol ini jika Bapak/Ibu ingin menghapus seluruh data barang, pelanggan, dan penjualan, lalu memulai pengisian data dari nol seperti pengguna baru. Data admin utama dan kategori dasar tidak akan dihapus.
            </p>
            {resetError && (
              <p className="text-xs font-bold text-rose-700 bg-rose-100 p-3.5 rounded-xl animate-shake mt-2">
                Peringatan: {resetError}
              </p>
            )}
          </div>
          
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            disabled={resetLoading}
            className="w-full md:w-auto bg-[#DC2626] hover:bg-[#B91C1C] disabled:bg-gray-300 text-white font-extrabold px-6 py-4 rounded-2xl text-sm transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {resetLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Mereset Data...
              </>
            ) : (
              "Hapus Semua Data & Mulai Dari Awal"
            )}
          </button>
        </div>

      </div>

      {/* Confirm Modal for System Reset */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Hapus Seluruh Data"
        message="Apakah Bapak/Ibu yakin ingin menghapus seluruh data barang, pelanggan, dan penjualan? Semua catatan pembukuan akan hilang permanen dan tindakan ini tidak dapat dibatalkan."
        onConfirm={handleResetConfirm}
        onCancel={() => setIsResetConfirmOpen(false)}
        confirmLabel="YA, HAPUS SEMUA"
        cancelLabel="BATAL"
      />
    </div>
  );
}
