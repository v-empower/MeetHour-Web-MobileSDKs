<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MeetingController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::post('/meetings/getaccesstoken', [MeetingController::class, 'getaccesstoken'])->name('meetings.getaccesstoken');
Route::get('/schedule-meeting', [MeetingController::class, 'schedulepage'])->name('meetings.schedulepage');
Route::get('/join-meeting', [MeetingController::class, 'joinmeetingpage'])->name('meetings.joinmeetingpage');
Route::post('/join-meeting', [MeetingController::class, 'joinmeetingpage'])->name('meetings.joinmeetingpage');
Route::post('meeitngs/create', [MeetingController::class, 'create'])->name('meetings.create');
