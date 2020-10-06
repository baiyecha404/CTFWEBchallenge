<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

use App\Task;
use Illuminate\Http\Request;

Route::group(['middleware' => ['web']], function () {
    /**
     * Show Task Dashboard
     */
    Route::get('/', 'FileUploadController@fileUpload')->name('file.upload');
    Route::post('file-upload', 'FileUploadController@fileUploadPost')->name('file.upload.post');
    Route::post('file-upload-url', 'FileUploadController@fileUploadUrlPost')->name('file.upload.url.post');


    
});
