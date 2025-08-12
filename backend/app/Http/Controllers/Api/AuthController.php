<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    /**
     * Login untuk admin.
     */
    public function loginAdmin(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('username', $request->username)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'message' => 'Username atau password salah'
            ], 401);
        }

        // Buat token Sanctum
        $token = $admin->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Login berhasil',
            'admin'        => [
                'id'       => $admin->id,
                'username' => $admin->username,
            ],
            'token_type'   => 'Bearer',
            'access_token' => $token,
        ]);
    }

    /**
     * Update profil admin yang sedang login (pakai token).
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'username'         => 'required|string',
            'current_password' => 'required|string',
            'new_password'     => 'nullable|string|min:4|confirmed',
        ]);

        $admin = $request->user();

        if (!$admin || !$admin instanceof Admin) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!Hash::check($request->current_password, $admin->password)) {
            return response()->json(['message' => 'Password lama salah'], 401);
        }

        $admin->username = $request->username;

        if ($request->filled('new_password')) {
            $admin->password = Hash::make($request->new_password);
        }

        $admin->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'admin'   => [
                'id'       => $admin->id,
                'username' => $admin->username,
            ],
        ]);
    }

    /**
     * Update profil admin dengan id=1 (langsung, tanpa login).
     * ✅ Sudah ditambahkan validasi password lama.
     */
    public function updateProfileById1(Request $request)
    {
        $request->validate([
            'username'           => 'required|string',
            'current_password'   => 'required|string',
            'new_password'       => 'nullable|string|min:4|confirmed',
        ]);

        $admin = Admin::find(1);

        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        // Cek password lama
        if (!Hash::check($request->current_password, $admin->password)) {
            return response()->json(['message' => 'Password salah'], 401);
        }

        $admin->username = $request->username;

        if ($request->filled('new_password')) {
            $admin->password = Hash::make($request->new_password);
        }

        $admin->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'admin'   => [
                'id'       => $admin->id,
                'username' => $admin->username,
            ],
        ]);
    }

    /**
     * Ambil data profil admin dengan id=1.
     */
    public function getAdminProfile()
    {
        $admin = Admin::find(1);

        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        return response()->json([
            'id'       => $admin->id,
            'username' => $admin->username,
        ]);
    }
}
