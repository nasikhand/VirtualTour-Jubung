<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

// --- Import Semua Controller yang Dibutuhkan ---
use App\Http\Controllers\FileController;
use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\Api\AboutUsSectionController;
use App\Http\Controllers\Api\FooterController;
use App\Http\Controllers\Api\VtourSceneController;
use App\Http\Controllers\Api\VtourHotspotController;
use App\Http\Controllers\Api\VtourMenuController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ===================================
// RUTE TES & AKSES FILE
// ===================================
Route::get('/test-cors', function () {
    return response()->json(['message' => 'CORS Berhasil!']);
});

Route::get('/vtour/storage/{path}', [FileController::class, 'getVtourImage'])->where('path', '.*');


// ===================================
// RUTE AUTENTIKASI & USER
// ===================================
Route::post('/login/admin', [AuthController::class, 'loginAdmin']);
Route::get('/admin/profile', [AuthController::class, 'getAdminProfile']);
Route::put('/admin/update-profile-id1', [AuthController::class, 'updateProfileById1']);
Route::middleware('auth:sanctum')->put('/admin/update-profile', [AuthController::class, 'updateProfile']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ===================================
// ABOUT US
// ===================================
// Route::apiResource('about-us', AboutUsSectionController::class)->parameters(['about-us' => 'aboutUsSection']);
// Route::post('/about-us/{aboutUsSection}', [AboutUsSectionController::class, 'update']);


// ===================================
// VIRTUAL TOUR
// ===================================
// Salin bagian ini dari api.php lama ke yang baru
Route::prefix('vtour')->group(function () {
    Route::apiResource('scenes', VtourSceneController::class);
    Route::apiResource('scenes.hotspots', VtourHotspotController::class)->only(['index', 'store']);
    Route::post('scenes/{scene}/sync-links', [VtourHotspotController::class, 'syncLinks']);
    Route::apiResource('menus', VtourMenuController::class);
    Route::post('menus/update-order', [VtourMenuController::class, 'updateOrder']);
    // Route::get('/settings', [AboutUsSectionController::class, 'getVtourSettings']);
    // Route::post('/settings/logo', [AboutUsSectionController::class, 'updateVtourLogo']);
});
Route::apiResource('hotspots', VtourHotspotController::class)->except(['index', 'store']);
Route::get('/vtour/storage/{path}', [FileController::class, 'getVtourImage'])->where('path', '.*');
Route::delete('/vtour/storage/delete', [FileController::class, 'deleteVtourFile']);


// ===================================
// FOOTER
// ===================================
Route::prefix('admin')->group(function () {
    Route::get('/footer', [FooterController::class, 'index']);
    Route::post('/footer', [FooterController::class, 'store']);
    Route::post('/footer/reset', [FooterController::class, 'reset']);
});


// ✅ Route untuk menghapus file audio vtour dari storage
Route::delete('/vtour/storage/delete', [FileController::class, 'deleteVtourFile']);

// Route::get('/vtour/settings', [AboutUsSectionController::class, 'getVtourSettings']);
// Route::post('/vtour/settings/logo', [AboutUsSectionController::class, 'updateVtourLogo']);
