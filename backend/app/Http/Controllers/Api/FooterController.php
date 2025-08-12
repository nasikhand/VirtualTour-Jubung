<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Footer;

class FooterController extends Controller
{
    // Ambil data footer (row pertama)
    public function index()
    {
        $footer = Footer::first();
        if (!$footer) {
            return response()->json(['message' => 'Footer not found'], 404);
        }

        return response()->json($footer);
    }

    // Simpan (update jika ada, insert jika belum)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contact_title'   => 'nullable|max:255',
            'contact_item1'   => 'nullable|max:255',
            'contact_item2'   => 'nullable|max:255',
            'contact_item3'   => 'nullable|max:255',
            'contact_item4'   => 'nullable|max:255',
            'other_title'     => 'nullable|max:255',
            'other_item1'     => 'nullable|max:255',
            'other_item2'     => 'nullable|max:255',
            'other_item3'     => 'nullable|max:255',
            'other_item4'     => 'nullable|max:255',
            'connect_title'   => 'nullable|max:255',
            'connect_item1'   => 'nullable|max:255',
            'connect_item2'   => 'nullable|max:255',
            'connect_item3'   => 'nullable|max:255',
            'connect_item4'   => 'nullable|max:255',
        ]);

        $footer = Footer::first();

        if ($footer) {
            $footer->update($validated);
        } else {
            $footer = Footer::create($validated);
        }

        return response()->json([
            'message' => 'Footer berhasil disimpan',
            'data' => $footer->fresh()
        ]);
    }

    // Reset footer ke default kosong (opsional)
    public function reset()
    {
        $footer = Footer::first();
        if ($footer) {
            $footer->update([
                'contact_title' => null, 'contact_item1' => null, 'contact_item2' => null, 'contact_item3' => null, 'contact_item4' => null,
                'other_title' => null, 'other_item1' => null, 'other_item2' => null, 'other_item3' => null, 'other_item4' => null,
                'connect_title' => null, 'connect_item1' => null, 'connect_item2' => null, 'connect_item3' => null, 'connect_item4' => null,
            ]);
        }
        return response()->json(['message' => 'Footer berhasil direset']);
    }
}
