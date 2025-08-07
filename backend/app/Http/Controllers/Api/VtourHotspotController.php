<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VtourHotspot;
use App\Models\VtourScene;
use Illuminate\Http\Request;

class VtourHotspotController extends Controller
{
    public function index(VtourScene $scene)
    {
        return response()->json($scene->hotspots()->with('targetScene')->get());
    }

    public function store(Request $request, VtourScene $scene)
    {
        // ✅ Validasi diperbarui untuk menerima 'sentences'
        $data = $request->validate([
            'type' => 'required|in:info,link',
            'yaw' => 'required|numeric',
            'pitch' => 'required|numeric',
            'label' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'target_scene_id' => 'nullable|exists:vtour_scenes,id',
            'sentences' => 'nullable|array', // Harus berupa array
            'sentences.*.id' => 'required_with:sentences|string', // Tiap item harus punya id
            'sentences.*.clause' => 'required_with:sentences|string', // Tiap item harus punya clause
            'sentences.*.voiceSource' => 'required_with:sentences|in:browser,file',
            'sentences.*.voiceUrl' => 'nullable|string|url',
            'icon_name' => 'nullable|string|max:50',
        ]);

        $hotspot = $scene->hotspots()->create($data);

        return response()->json(['data' => $hotspot], 201);
    }

    public function show(VtourHotspot $hotspot)
    {
        return response()->json($hotspot->load(['scene', 'targetScene']));
    }

    public function update(Request $request, VtourHotspot $hotspot)
    {
        // ✅ Validasi HANYA untuk field yang bisa diubah dari InfoEditor
        $data = $request->validate([
            'label' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'sentences' => 'nullable|array',
            'sentences.*.id' => 'required_with:sentences|string',
            'sentences.*.clause' => 'required_with:sentences|string',
            'sentences.*.voiceSource' => 'required_with:sentences|in:browser,file',
            'sentences.*.voiceUrl' => 'nullable|string|url',
        ]);

        // Untuk memastikan field lain tidak ikut terhapus jika tidak dikirim,
        // kita hanya akan mengisi field yang ada di request.
        $hotspot->fill($data);
        $hotspot->save();

        return response()->json($hotspot);
    }

    public function destroy(VtourHotspot $hotspot)
    {
        $hotspot->delete();
        return response()->json(null, 204);
    }
}
