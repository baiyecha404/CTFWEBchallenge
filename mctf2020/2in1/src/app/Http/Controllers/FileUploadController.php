<?php
   
namespace App\Http\Controllers;
  
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
 
ini_set("gd.jpeg_ignore_warning", 1);
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}


function get_image_type ( $filename ) {


    $img = getimagesize( $filename );
   


    if ( !empty( $img[2] ) )
        return image_type_to_mime_type( $img[2] );
return false;
}



class FileUploadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function fileUpload()
    {
        return view('fileUpload');
    }
  
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function fileUploadPost(Request $request)
    {   

        $this->validate($request, [
            'file' => 'required|mimes:jpg,jpeg|max:2048',
        ]);
       
        $fileName = generateRandomString().'.jpeg';  
   
        $request->file->move(public_path('uploads'), $fileName);
   
        return back()
            ->with('success','You have successfully upload file.')
            ->with('file',$fileName);
   
    }



    public function fileUploadUrlPost(Request $request)
    {   
        
        if($request->url){

            if (substr( $request->url, 0, 4 ) === "http" or substr( $request->url, 0, 5 ) === "https" or substr( $request->url, 0, 4 ) === "phar"){
            
    
            $file = file_get_contents($request->url, FALSE, NULL, 0, 2048);
            // echo($file);
            $fileName = generateRandomString().'.jpeg';
            file_put_contents('/app/public/uploads/'.$fileName, $file);
        
            // var_dump(get_image_type('/app/public/uploads/'.$fileName));

            if(@get_image_type('/app/public/uploads/'.$fileName)) {
                return back()
                    ->with('success','File uploaded /app/public/uploads/')
                    ->with('file',$fileName); 
            }
            }
        }

        return back()
                ->with('Fail','File not image or url incorrect')->with('file',"undef");
        
   
    }
}