<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

// --- Import Semua Controller yang Dibutuhkan ---
use App\Http\Controllers\FileController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\InstagramController;
use App\Http\Controllers\InstagramFeedController;
use App\Http\Controllers\Api\SlideController;
use App\Http\Controllers\Api\CulinaryController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TravelMapController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\DestinationNearbyController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\AboutUsSectionController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\StatisticsController;
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
// RUTE ANALYTICS & STATISTIK
// ===================================
Route::post('/analytics/log-visit', [AnalyticsController::class, 'logVisit']);
Route::get('/analytics/today-visits', [AnalyticsController::class, 'todayVisits']);
Route::get('/analytics/weekly-visits', [AnalyticsController::class, 'weeklyVisits']);
Route::get('/analytics/monthly-visits', [AnalyticsController::class, 'monthlyVisits']);
Route::get('/analytics/yearly-visits', [AnalyticsController::class, 'yearlyVisits']);
Route::get('/statistics/totals', [StatisticsController::class, 'totals']);


// ===================================
// SLIDES
// ===================================
Route::apiResource('slides', SlideController::class);


// ===================================
// CULINARY
// ===================================
Route::apiResource('culinaries', CulinaryController::class);
Route::post('/culinaries/{id}', [CulinaryController::class, 'update']);
Route::get('/culinaries/hero', [CulinaryController::class, 'hero']);


// ===================================
// EVENTS
// ===================================
Route::apiResource('events', EventController::class);
Route::post('/events/{id}', [EventController::class, 'update']);
Route::get('/events/hero', [EventController::class, 'hero']);


// ===================================
// TRAVEL MAPS
// ===================================
Route::apiResource('travel-maps', TravelMapController::class);
Route::post('/travel-maps/{id}', [TravelMapController::class, 'update']);


// ===================================
// DESTINATIONS
// ===================================
Route::apiResource('destinations', DestinationController::class);
Route::post('/destinations/{id}', [DestinationController::class, 'update']);
Route::get('/destination/hero', [DestinationController::class, 'hero']);

Route::apiResource('destinations-nearby', DestinationNearbyController::class);


// ===================================
// GALLERY
// ===================================
Route::apiResource('gallery', GalleryController::class);
Route::post('/gallery/{id}', [GalleryController::class, 'update']);


// ===================================
// ABOUT US
// ===================================
Route::apiResource('about-us', AboutUsSectionController::class)->parameters(['about-us' => 'aboutUsSection']);
Route::post('/about-us/{aboutUsSection}', [AboutUsSectionController::class, 'update']);


// ===================================
// ARTICLES
// ===================================
Route::apiResource('articles', ArticleController::class);
Route::post('/articles/upload-image', [ArticleController::class, 'uploadImage']);
Route::post('/articles/{id}', [ArticleController::class, 'update']);
Route::get('/articles/hero', [ArticleController::class, 'hero']);


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
    Route::get('/settings', [AboutUsSectionController::class, 'getVtourSettings']);
    Route::post('/settings/logo', [AboutUsSectionController::class, 'updateVtourLogo']);
});
Route::apiResource('hotspots', VtourHotspotController::class)->except(['index', 'store']);
Route::get('/vtour/storage/{path}', [FileController::class, 'getVtourImage'])->where('path', '.*');
Route::delete('/vtour/storage/delete', [FileController::class, 'deleteVtourFile']);

// ===================================
// REVIEWS
// ===================================
Route::get('/reviews/approved', [ReviewController::class, 'approvedReviews']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::post('/reviews/upload-image', [ReviewController::class, 'uploadImage']);
Route::prefix('admin')->group(function () {
    Route::get('/reviews', [ReviewController::class, 'getAllForAdmin']);
    Route::patch('/reviews/{id}/status', [ReviewController::class, 'updateStatus']);
});


// ===================================
// INSTAGRAM
// ===================================
// Public Instagram feed API
Route::get('/instagram-fetch', [InstagramController::class, 'fetchHashtagFeed']);
Route::get('/instagram-feed', [InstagramFeedController::class, 'index']);
// Admin APIs
Route::prefix('admin')->group(function () {
    // Instagram Token
    Route::get('/instagram-token', [InstagramTokenController::class, 'index']);
    Route::post('/instagram-token', [InstagramTokenController::class, 'store']);
    // Instagram Setting
    Route::get('/instagram-setting', [InstagramSettingController::class, 'index']);
    Route::put('/instagram-setting', [InstagramSettingController::class, 'update']);
});


// ===================================
// FOOTER
// ===================================
Route::prefix('admin')->group(function () {
    Route::get('/footer', [FooterController::class, 'index']);
    Route::post('/footer', [FooterController::class, 'store']);
    Route::post('/footer/reset', [FooterController::class, 'reset']);
});


// ===================================
// CAPTCHA
// ===================================
Route::get('/captcha', function () {
    $a = rand(1, 9);
    $b = rand(1, 9);
    $answer = $a + $b;
    $token = Str::random(16);
    Cache::put('captcha_' . $token, $answer, 600);
    return response()->json(['question' => "$a + $b = ?", 'token' => $token]);
});

// ✅ Route untuk menghapus file audio vtour dari storage
Route::delete('/vtour/storage/delete', [FileController::class, 'deleteVtourFile']);

Route::get('/vtour/settings', [AboutUsSectionController::class, 'getVtourSettings']);
Route::post('/vtour/settings/logo', [AboutUsSectionController::class, 'updateVtourLogo']);
