<?php

// app/Http/Controllers/Api/VtourMenuController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VtourMenu;
use Illuminate\Support\Str;

class VtourMenuController extends Controller
{
    public function index()
    {
        $menus = VtourMenu::with('scene')->orderBy('order')->get();
        return response()->json(['data' => $menus]); // Dibungkus 'data'
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'scene_id' => 'required|exists:vtour_scenes,id',
            'preview_image' => 'nullable|string',
        ]);

        $menu = VtourMenu::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'scene_id' => $request->scene_id,
            'preview_image' => $request->preview_image,
            'is_active' => $request->boolean('is_active', true),
            'is_default' => $request->boolean('is_default', false),
            'order' => $request->input('order', 0),
        ]);

        return response()->json(['data' => $menu], 201);
    }

    public function update(Request $request, VtourMenu $menu)
    {
        $request->validate([
            'name' => 'sometimes|string',
            'scene_id' => 'sometimes|exists:vtour_scenes,id',
            'preview_image' => 'nullable|string',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
            'order' => 'integer',
        ]);

        $menu->update([
            'name' => $request->name ?? $menu->name,
            'slug' => Str::slug($request->name ?? $menu->name),
            'scene_id' => $request->scene_id ?? $menu->scene_id,
            'preview_image' => $request->preview_image,
            'is_active' => $request->is_active ?? $menu->is_active,
            'is_default' => $request->is_default ?? $menu->is_default,
            'order' => $request->order ?? $menu->order,
        ]);

        return response()->json(['data' => $menu]);
    }

    public function destroy(VtourMenu $menu)
    {
        $menu->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'menus' => 'required|array',
            'menus.*.id' => 'required|integer|exists:vtour_menus,id',
            'menus.*.order' => 'required|integer',
        ]);

        foreach ($request->menus as $menuData) {
            VtourMenu::where('id', $menuData['id'])->update(['order' => $menuData['order']]);
        }

        return response()->json(['message' => 'Menu order updated successfully']);
    }

}

