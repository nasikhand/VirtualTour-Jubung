<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VtourScene;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VtourSceneController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 6);
        $scenes = VtourScene::with('hotspots')->orderBy('id', 'asc')->paginate($perPage);
        return response()->json($scenes);
    }

    public function show($id)
    {
        $scene = VtourScene::with('hotspots.targetScene')->findOrFail($id);
        return response()->json(['data' => $scene]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        // ✅ PERUBAHAN: Simpan file dan dapatkan path relatif, BUKAN URL lengkap
        $path = $request->file('image')->store('vtour', 'public');

        $scene = VtourScene::create([
            'name' => $request->name,
            'image_path' => $path, // Simpan path relatif: 'vtour/namafile.jpg'
        ]);

        return response()->json([
            'message' => 'Scene berhasil ditambahkan.',
            'data' => $scene,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $scene = VtourScene::findOrFail($id);
        $scene->update($request->only(['name', 'default_yaw', 'default_pitch']));
        return response()->json([
            'message' => 'Scene berhasil diupdate.',
            'data' => $scene,
        ]);
    }

    public function destroy($id)
    {
        $scene = VtourScene::findOrFail($id);

        if ($scene->image_path) {
            Storage::disk('public')->delete($scene->image_path);
        }

        $scene->delete();
        return response()->json(['message' => 'Scene berhasil dihapus.']);
    }
}
