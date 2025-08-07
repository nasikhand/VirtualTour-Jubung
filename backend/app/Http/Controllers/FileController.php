<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function deleteVtourFile(Request $request)
    {
        $data = $request->validate([
            'url' => 'required|string|url'
        ]);

        try {
            // 1. Ambil hanya bagian path dari URL
            // Contoh: "http://localhost:8000/storage/vtour-audio/xyz.mp3" -> "/storage/vtour-audio/xyz.mp3"
            $urlPath = parse_url($data['url'], PHP_URL_PATH);

            if (!$urlPath) {
                return response()->json(['message' => 'Format URL tidak valid'], 400);
            }

            // 2. Hapus '/storage/' dari awal path untuk mendapatkan path relatif
            // Contoh: "/storage/vtour-audio/xyz.mp3" -> "vtour-audio/xyz.mp3"
            $storagePath = Str::after($urlPath, '/storage/');

            // 3. Cek dan hapus file
            if (Storage::disk('public')->exists($storagePath)) {
                Storage::disk('public')->delete($storagePath);
                return response()->json(['message' => 'File berhasil dihapus'], 200);
            }

            return response()->json(['message' => 'File tidak ditemukan di storage'], 404);

        } catch (\Exception $e) {
            // Tangani jika ada error tak terduga
            return response()->json(['message' => 'Terjadi kesalahan di server saat menghapus file.'], 500);
        }
    }

    public function getVtourImage($path)
    {
        // Keamanan: Hanya ambil nama file untuk mencegah akses ke folder lain
        $safePath = basename($path);
        $fullStoragePath = 'vtour/' . $safePath;

        // Verifikasi file ada
        if (!Storage::disk('public')->exists($fullStoragePath)) {
            abort(404, 'File not found.');
        }

        $filePath = Storage::disk('public')->path($fullStoragePath);

        // Kirim file sebagai response
        return response()->file($filePath);
    }
}
